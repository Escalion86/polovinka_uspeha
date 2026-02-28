import { getServerSession } from 'next-auth'
import { authOptions } from '@server/authOptions'
import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'
import {
  beginGoogleCalendarAuth,
  disconnectGoogleCalendar,
  getGoogleCalendarSettings,
  selectGoogleCalendar,
} from '@server/userGoogleCalendar'

const sendError = (res, status, type, message) =>
  res.status(status).json({
    success: false,
    data: { error: { type, message } },
  })

export default async function handler(req, res) {
  const { method, query } = req
  const location = query?.location

  if (!location || !checkLocationValid(location)) {
    return sendError(
      res,
      400,
      'location_invalid',
      'Некорректная локация в запросе'
    )
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?._id) {
    return sendError(
      res,
      401,
      'unauthorized',
      'Требуется авторизация пользователя'
    )
  }

  if (session.location !== location) {
    return sendError(
      res,
      403,
      'location_forbidden',
      'Сессия пользователя принадлежит другой локации'
    )
  }

  const db = await dbConnect(location)
  if (!db) {
    return sendError(res, 500, 'db_error', 'Не удалось подключиться к базе данных')
  }

  const userId = String(session.user._id)

  try {
    if (method === 'GET') {
      const result = await getGoogleCalendarSettings({ db, location, userId })
      if (!result?.success) {
        return res
          .status(result?.status || 400)
          .json(result || { success: false, data: { error: { type: 'google_calendar_read_failed', message: 'Не удалось получить настройки Google Календаря' } } })
      }
      return res.status(200).json(result)
    }

    if (method === 'POST') {
      const action = req?.body?.data?.action

      if (action === 'beginAuth') {
        const result = await beginGoogleCalendarAuth({ db, location, userId })
        if (!result?.success) {
          return res.status(result?.status || 400).json(result)
        }
        return res.status(200).json(result)
      }

      if (action === 'selectCalendar') {
        const calendarId = req?.body?.data?.calendarId
        const calendarSummary = req?.body?.data?.calendarSummary
        const result = await selectGoogleCalendar({
          db,
          location,
          userId,
          calendarId,
          calendarSummary,
        })
        if (!result?.success) {
          return res.status(result?.status || 400).json(result)
        }
        return res.status(200).json(result)
      }

      return sendError(
        res,
        400,
        'action_invalid',
        'Неизвестное действие для Google Календаря'
      )
    }

    if (method === 'DELETE') {
      const result = await disconnectGoogleCalendar({ db, location, userId })
      if (!result?.success) {
        return res.status(result?.status || 400).json(result)
      }
      return res.status(200).json(result)
    }

    return sendError(res, 405, 'method_not_allowed', 'Метод не поддерживается')
  } catch (error) {
    console.log('google-calendar api error:', error)
    return sendError(
      res,
      500,
      'internal_error',
      'Внутренняя ошибка интеграции Google Календаря'
    )
  }
}
