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
  userRelationshipDataChanged: {
    role: (role) =>
      Boolean(role?.notifications?.userRelationshipDataChanged),
    settings: (settings) =>
      Boolean(settings?.userRelationshipDataChanged),
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
  eventUserMoves: {
    role: () => true,
    settings: (settings) => Boolean(settings?.eventUserMoves),
  },
  eventCancel: {
    role: () => true,
    settings: (settings) => Boolean(settings?.eventCancel),
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
    entities:
      item?.entities && typeof item.entities === 'object'
        ? item.entities
        : {},
    createdAt: item?.deliveredAt || item?.createdAt || null,
  }))

const arrayFromValue = (value) => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (value && typeof value === 'object') {
    return Object.values(value).map(String).filter(Boolean)
  }
  return []
}

const isAllowedByAudience = ({ audience, roleId, userStatus }) => {
  if (!audience || typeof audience !== 'object') return true

  const roleIds = arrayFromValue(audience?.roleIds)
  const statuses = arrayFromValue(audience?.statuses)

  const roleAllowed =
    roleIds.length === 0 || (roleId ? roleIds.includes(String(roleId)) : false)
  const statusAllowed =
    statuses.length === 0 ||
    (userStatus ? statuses.includes(String(userStatus)) : false)

  return roleAllowed && statusAllowed
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
  const userId = String(session?.user?._id || '')
  const db = await dbConnect(location)
  if (!db) {
    return sendError(res, 500, 'db_error', 'Не удалось подключиться к БД')
  }

  const limitRaw = Number(query?.limit)
  const limit = Number.isFinite(limitRaw)
    ? Math.max(1, Math.min(200, Math.floor(limitRaw)))
    : 100

  try {
    const user = await db
      .model('Users')
      .findById(userId)
      .select({ role: 1, status: 1, notifications: 1 })
      .lean()

    if (!user?._id) {
      return sendError(res, 404, 'user_not_found', 'Пользователь не найден')
    }

    const roleId = String(user?.role || '')
    const userStatus = String(user?.status || 'novice')
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

    const docsRaw = await db
      .model('NotificationsHistory')
      .find({
        scope: 'shared',
        location,
        $or: [{ type: { $in: visibleTypes } }, { types: { $in: visibleTypes } }],
      })
      .sort({ deliveredAt: -1, createdAt: -1 })
      .limit(limit * 4)
      .lean()
    const docs = docsRaw
      .filter((doc) =>
        isAllowedByAudience({
          audience: doc?.audience,
          roleId,
          userStatus,
        })
      )
      .slice(0, limit)
    return res.status(200).json({
      success: true,
      data: {
        history: normalizeHistory(docs),
        visibleTypes,
      },
    })
  } catch (error) {
    console.log('[NotificationsHistory] api error:', {
      location,
      userId: session?.user?._id,
      role: session?.user?.role,
      message: error?.message || String(error),
      stack: error?.stack || null,
    })
    return sendError(
      res,
      500,
      'internal_error',
      'Ошибка при получении истории уведомлений'
    )
  }
}
