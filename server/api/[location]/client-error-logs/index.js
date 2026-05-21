import { getServerSession } from 'next-auth'

import { authOptions } from '@server/authOptions'
import checkLocationValid from '@server/checkLocationValid'
import { DEFAULT_ROLES } from '@helpers/constantsServer'
import dbConnect from '@utils/dbConnect'

const sendError = (res, status, type, message) =>
  res.status(status).json({
    success: false,
    data: { error: { type, message } },
  })

const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value !== 'string') return defaultValue
  const normalized = value.trim().toLowerCase()
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false
  return defaultValue
}

const parseNumber = (value, fallback, min, max) => {
  const raw = Number(value)
  if (!Number.isFinite(raw)) return fallback
  return Math.max(min, Math.min(max, Math.floor(raw)))
}

const toRoleObject = async (db, roleId) => {
  const defaults = Array.isArray(DEFAULT_ROLES) ? DEFAULT_ROLES : []
  const defaultRole = defaults.find(
    (role) => String(role?._id || '') === String(roleId || '')
  )
  if (defaultRole) return defaultRole
  return await db.model('Roles').findById(roleId).lean()
}

const isDevAccessAllowed = (role) => Boolean(role?.dev || role?.president)

const buildUaFilter = ({ onlyIphone, onlySafari }) => {
  if (!onlyIphone && !onlySafari) return null

  const conditions = []
  if (onlyIphone) {
    conditions.push({ userAgent: { $regex: 'iPhone', $options: 'i' } })
  }
  if (onlySafari) {
    conditions.push({ userAgent: { $regex: 'Safari', $options: 'i' } })
    conditions.push({ userAgent: { $not: /CriOS|FxiOS|EdgiOS/i } })
  }

  if (conditions.length === 1) return conditions[0]
  return { $and: conditions }
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

  const db = await dbConnect(location)
  if (!db) {
    return sendError(res, 500, 'db_error', 'Не удалось подключиться к БД')
  }

  const role = await toRoleObject(db, session?.user?.role)
  if (!isDevAccessAllowed(role)) {
    return sendError(
      res,
      403,
      'forbidden',
      'Недостаточно прав для просмотра клиентских ошибок'
    )
  }

  const limit = parseNumber(query?.limit, 100, 1, 500)
  const offset = parseNumber(query?.offset, 0, 0, 50000)
  const hours = parseNumber(query?.hours, 72, 1, 24 * 365)
  const onlyIphone = parseBoolean(query?.onlyIphone, true)
  const onlySafari = parseBoolean(query?.onlySafari, true)
  const search = String(query?.search || '').trim()

  const dateFrom = new Date(Date.now() - hours * 60 * 60 * 1000)

  const filter = {
    createdAt: { $gte: dateFrom },
  }

  const uaFilter = buildUaFilter({ onlyIphone, onlySafari })
  if (uaFilter) {
    filter.$and = [...(filter.$and || []), uaFilter]
  }

  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'i')
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { message: { $regex: regex } },
          { stack: { $regex: regex } },
          { componentStack: { $regex: regex } },
          { url: { $regex: regex } },
          { userAgent: { $regex: regex } },
        ],
      },
    ]
  }

  try {
    const [itemsRaw, total] = await Promise.all([
      db
        .model('ClientErrorLogs')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      db.model('ClientErrorLogs').countDocuments(filter),
    ])

    const items = itemsRaw.map((item) => ({
      _id: String(item?._id || ''),
      message: String(item?.message || ''),
      stack: String(item?.stack || ''),
      componentStack: String(item?.componentStack || ''),
      url: String(item?.url || ''),
      userAgent: String(item?.userAgent || ''),
      location: String(item?.location || location),
      userInfo: item?.userInfo ?? null,
      meta: item?.meta ?? null,
      createdAt: item?.createdAt ?? null,
      updatedAt: item?.updatedAt ?? null,
    }))

    return res.status(200).json({
      success: true,
      data: {
        items,
        total,
        limit,
        offset,
        hours,
        onlyIphone,
        onlySafari,
        search,
      },
    })
  } catch (error) {
    console.log('[ClientErrorLogs] api error:', {
      location,
      userId: session?.user?._id,
      message: error?.message || String(error),
      stack: error?.stack || null,
    })
    return sendError(
      res,
      500,
      'internal_error',
      'Ошибка при получении клиентских ошибок'
    )
  }
}

