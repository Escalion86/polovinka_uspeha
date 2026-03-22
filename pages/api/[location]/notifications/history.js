import { getServerSession } from 'next-auth'
import { authOptions } from '@server/authOptions'
import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'
import { DEFAULT_ROLES } from '@helpers/constantsServer'

const sendError = (res, status, type, message) =>
  res.status(status).json({
    success: false,
    data: { error: { type, message } },
  })

const TYPE_ACCESS_CHECKS = {
  newEvents: {
    role: (role) =>
      Boolean(
        role?.notifications?.newEvents ?? role?.notifications?.newEventsByTags
      ),
    settings: (settings) =>
      Boolean(settings?.newEvents ?? settings?.newEventsByTags),
  },
  newUserRegistred: {
    role: (role) => Boolean(role?.notifications?.newUserRegistred),
    settings: (settings) => Boolean(settings?.newUserRegistred),
  },
  eventRegistration: {
    role: (role) => Boolean(role?.notifications?.eventRegistration),
    settings: (settings) => Boolean(settings?.eventRegistration),
  },
  serviceRegistration: {
    role: (role) => Boolean(role?.notifications?.serviceRegistration),
    settings: (settings) => Boolean(settings?.serviceRegistration),
  },
  birthdays: {
    role: (role) => Boolean(role?.notifications?.birthdays),
    settings: (settings) => Boolean(settings?.birthdays),
  },
  remindDates: {
    role: (role) => Boolean(role?.notifications?.remindDates),
    settings: (settings) => Boolean(settings?.remindDates),
  },
}

const getRoleForUser = async (db, roleId) => {
  const defaults = Array.isArray(DEFAULT_ROLES) ? DEFAULT_ROLES : []
  const defaultRole = defaults.find((role) => String(role?._id || '') === String(roleId || ''))
  if (defaultRole) return defaultRole

  const customRole = await db.model('Roles').findOne({ _id: roleId }).lean()
  return customRole || null
}

const normalizeHistory = (items = []) =>
  items.map((item) => ({
    notificationId: String(item?.notificationId || ''),
    type: String(item?.type || ''),
    types: Array.isArray(item?.types) ? item.types.map(String).filter(Boolean) : [],
    title: String(item?.title || 'Половинка успеха'),
    body: String(item?.body || ''),
    url: String(item?.url || ''),
    tag: String(item?.tag || ''),
    location: String(item?.location || ''),
    channels:
      item?.channels && typeof item.channels === 'object'
        ? item.channels
        : {},
    createdAt: item?.deliveredAt || item?.createdAt || null,
  }))

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

  const db = await dbConnect(location)
  if (!db) {
    return sendError(res, 500, 'db_error', 'Не удалось подключиться к БД')
  }

  const userId = String(session.user._id)
  const limitRaw = Number(query?.limit)
  const limit = Number.isFinite(limitRaw)
    ? Math.max(1, Math.min(200, Math.floor(limitRaw)))
    : 100

  try {
    const user = await db
      .model('Users')
      .findById(userId)
      .select({ role: 1, notifications: 1 })
      .lean()

    if (!user?._id) {
      return sendError(res, 404, 'user_not_found', 'Пользователь не найден')
    }

    const role = await getRoleForUser(db, user?.role)
    const settings =
      user?.notifications?.settings && typeof user.notifications.settings === 'object'
        ? user.notifications.settings
        : {}

    const visibleTypes = Object.entries(TYPE_ACCESS_CHECKS)
      .filter(([, checker]) => checker.role(role) && checker.settings(settings))
      .map(([type]) => type)

    if (visibleTypes.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          history: [],
          visibleTypes,
        },
      })
    }

    const docs = await db
      .model('NotificationsHistory')
      .find({
        recipientUserId: userId,
        $or: [{ type: { $in: visibleTypes } }, { types: { $in: visibleTypes } }],
      })
      .sort({ deliveredAt: -1, createdAt: -1 })
      .limit(limit)
      .lean()

    return res.status(200).json({
      success: true,
      data: {
        history: normalizeHistory(docs),
        visibleTypes,
      },
    })
  } catch (error) {
    console.log('notifications history api error:', error)
    return sendError(
      res,
      500,
      'internal_error',
      'Ошибка при получении истории уведомлений'
    )
  }
}
