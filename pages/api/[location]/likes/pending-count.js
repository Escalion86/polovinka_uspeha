import { getServerSession } from 'next-auth'

import { authOptions } from '@server/authOptions'
import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

const sendError = (res, status, type, message) =>
  res.status(status).json({
    success: false,
    data: { error: { type, message } },
  })

export default async function handler(req, res) {
  const { method, query } = req
  const location = query?.location

  if (!location || !checkLocationValid(location)) {
    return sendError(res, 400, 'location_invalid', 'Некорректная локация')
  }
  if (method !== 'GET') {
    return sendError(res, 405, 'method_not_allowed', 'Метод не поддерживается')
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?._id) {
    return sendError(res, 401, 'unauthorized', 'Требуется авторизация')
  }
  if (session.location !== location) {
    return sendError(
      res,
      403,
      'location_forbidden',
      'Сессия пользователя принадлежит другой локации'
    )
  }

  const userId = String(session.user._id || '')
  if (!userId) {
    return sendError(
      res,
      401,
      'unauthorized',
      'Не удалось определить пользователя'
    )
  }

  const db = await dbConnect(location)
  if (!db) {
    return sendError(res, 500, 'db_error', 'Не удалось подключиться к БД')
  }

  try {
    const now = new Date()
    const eventsWithOpenLikes = await db
      .model('Events')
      .find({
        likes: true,
        likesProcessActive: true,
        status: { $ne: 'canceled' },
        dateStart: { $ne: null, $lte: now },
      })
      .select({ _id: 1 })
      .lean()

    if (eventsWithOpenLikes.length === 0) {
      return res.status(200).json({
        success: true,
        data: { count: 0 },
      })
    }

    const eventsWithOpenLikesIds = eventsWithOpenLikes.map((event) =>
      String(event._id)
    )

    const pendingLikesEventIds = await db.model('EventsUsers').distinct('eventId', {
      userId,
      status: 'participant',
      eventId: { $in: eventsWithOpenLikesIds },
      $or: [{ likes: null }, { likes: { $exists: false } }],
    })

    return res.status(200).json({
      success: true,
      data: { count: pendingLikesEventIds.length },
    })
  } catch (error) {
    console.log('[LikesPendingCount] api error:', {
      location,
      userId,
      message: error?.message || String(error),
      stack: error?.stack || null,
    })
    return sendError(
      res,
      500,
      'internal_error',
      'Ошибка при вычислении бейджа лайков'
    )
  }
}

