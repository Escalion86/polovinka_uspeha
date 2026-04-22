import { getServerSession } from 'next-auth'

import { authOptions } from '@server/authOptions'
import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

const EMPTY_DASHBOARD = Object.freeze({
  eventsWithWaitingLikes: [],
  eventsWithSettedLikes: [],
  usersWithLikesCoincidences: [],
})

const sendError = (res, status, type, message) =>
  res.status(status).json({
    success: false,
    data: { error: { type, message } },
  })

const normalizeEventUsers = (items = []) =>
  items.map((item) => ({
    userId: String(item?.userId || ''),
    status: String(item?.status || ''),
    likes: Array.isArray(item?.likes) ? item.likes.map(String) : item?.likes,
    seeLikesResult: Boolean(item?.seeLikesResult),
  }))

const buildDashboard = ({ events = [], eventUsersByEventId = {}, loggedUserId }) => {
  const eventsWithWaitingLikes = []
  const eventsWithSettedLikes = []
  const usersWithLikesCoincidences = new Set()

  for (const event of events) {
    const eventId = String(event?._id || '')
    if (!eventId) continue
    const eventUsers = eventUsersByEventId[eventId] || []
    const eventLoggedUser = eventUsers.find((item) => item.userId === loggedUserId)
    if (!eventLoggedUser || eventLoggedUser.status !== 'participant') continue

    const nextEvent = { ...event, _id: eventId, eventUsers }
    if (event?.likesProcessActive) {
      eventsWithWaitingLikes.push(nextEvent)
      continue
    }

    eventsWithSettedLikes.push(nextEvent)

    if (!eventLoggedUser.seeLikesResult || !Array.isArray(eventLoggedUser.likes)) {
      continue
    }

    for (const eventUser of eventUsers) {
      if (
        !Array.isArray(eventUser?.likes) ||
        eventUser.userId === loggedUserId ||
        !eventUser.likes.includes(loggedUserId)
      ) {
        continue
      }
      if (eventLoggedUser.likes.includes(eventUser.userId)) {
        usersWithLikesCoincidences.add(eventUser.userId)
      }
    }
  }

  return {
    eventsWithWaitingLikes,
    eventsWithSettedLikes,
    usersWithLikesCoincidences: Array.from(usersWithLikesCoincidences),
  }
}

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

  const loggedUserId = String(session?.user?._id || '')
  if (!loggedUserId) {
    return sendError(
      res,
      401,
      'unauthorized',
      'Не удалось определить пользователя'
    )
  }

  if (session?.user?.relationship) {
    return res.status(200).json({ success: true, data: EMPTY_DASHBOARD })
  }

  const db = await dbConnect(location)
  if (!db) {
    return sendError(res, 500, 'db_error', 'Не удалось подключиться к БД')
  }

  try {
    const now = new Date()

    const eventsForLikes = await db.model('EventsUsers').aggregate([
      {
        $match: {
          userId: loggedUserId,
          status: 'participant',
        },
      },
      {
        $lookup: {
          from: 'events',
          let: { eventId: '$eventId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$eventId'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                directionId: 1,
                title: 1,
                dateStart: 1,
                dateEnd: 1,
                status: 1,
                likes: 1,
                likesProcessActive: 1,
              },
            },
          ],
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $match: {
          'event.likes': true,
          'event.status': { $ne: 'canceled' },
          'event.dateStart': { $ne: null, $lte: now },
        },
      },
      {
        $group: {
          _id: '$eventId',
          event: { $first: '$event' },
        },
      },
      { $sort: { 'event.dateStart': -1, _id: 1 } },
    ])

    if (eventsForLikes.length === 0) {
      return res.status(200).json({ success: true, data: EMPTY_DASHBOARD })
    }

    const eventIds = eventsForLikes.map((row) => String(row?._id || '')).filter(Boolean)
    const allEventsUsers = await db
      .model('EventsUsers')
      .find({ eventId: { $in: eventIds } })
      .select({
        eventId: 1,
        userId: 1,
        status: 1,
        likes: 1,
        seeLikesResult: 1,
      })
      .lean()

    const eventUsersByEventId = allEventsUsers.reduce((acc, item) => {
      const eventId = String(item?.eventId || '')
      if (!eventId) return acc
      if (!acc[eventId]) acc[eventId] = []
      acc[eventId].push(item)
      return acc
    }, {})

    for (const eventId of Object.keys(eventUsersByEventId)) {
      eventUsersByEventId[eventId] = normalizeEventUsers(eventUsersByEventId[eventId])
    }

    const events = eventsForLikes.map((row) => ({
      ...row.event,
      _id: String(row?.event?._id || row?._id || ''),
    }))

    const dashboard = buildDashboard({
      events,
      eventUsersByEventId,
      loggedUserId,
    })

    return res.status(200).json({
      success: true,
      data: dashboard,
    })
  } catch (error) {
    console.log('[LikesDashboard] api error:', {
      location,
      loggedUserId,
      message: error?.message || String(error),
      stack: error?.stack || null,
    })
    return sendError(
      res,
      500,
      'internal_error',
      'Ошибка при загрузке данных страницы лайков'
    )
  }
}

