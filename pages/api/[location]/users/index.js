import mongoose from 'mongoose'
import CRUD from '@server/CRUD'
import dbConnectGlobal from '@utils/dbConnectGlobal'

const usersSelect = {
  images: { $slice: [0, 1] },
  haveKids: 0,
  // security: 0,
  // notifications: 0,
  town: 0,
  prevActivityAt: 0,
  lastActivityAt: 0,
  archive: 0,
  // role: 0,
  registrationType: 0,
}

const normalizePhone = (rawValue) => {
  if (rawValue === null || typeof rawValue === 'undefined') return ''

  let digits = String(rawValue).replace(/\D/g, '')
  if (!digits) return ''

  if (digits.length > 11) digits = digits.slice(-11)
  if (digits.length === 10) return `7${digits}`

  if (digits.length === 11) {
    if (digits[0] === '8') return `7${digits.slice(1)}`
    if (digits[0] === '7') return digits
    return `7${digits.slice(-10)}`
  }

  if (digits[0] === '8') return `7${digits.slice(1)}`
  if (digits[0] === '7') return digits
  return `7${digits}`
}

const resolveGlobalConsentMap = async (users) => {
  if (!Array.isArray(users) || users.length === 0) return new Map()

  const globalDb = await dbConnectGlobal()
  if (!globalDb) return new Map()

  const globalUserIds = [
    ...new Set(
      users
        .map((user) => String(user?.globalUserId || '').trim())
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
    ),
  ]

  const phones = [
    ...new Set(
      users
        .map((user) => normalizePhone(user?.phone))
        .filter((phone) => /^7\d{10}$/.test(phone))
        .map((phone) => Number(phone))
        .filter((phone) => Number.isFinite(phone))
    ),
  ]

  if (globalUserIds.length === 0 && phones.length === 0) return new Map()

  const globalUsers = await globalDb
    .model('GlobalUsers')
    .find(
      {
        $or: [
          ...(globalUserIds.length > 0
            ? [{ _id: { $in: globalUserIds } }]
            : []),
          ...(phones.length > 0 ? [{ phone: { $in: phones } }] : []),
        ],
      },
      { _id: 1, phone: 1, 'notifications.consentToMailing': 1 }
    )
    .lean()

  const globalConsentMap = new Map()
  globalUsers.forEach((globalUser) => {
    const consent =
      typeof globalUser?.notifications?.consentToMailing === 'boolean'
        ? globalUser.notifications.consentToMailing
        : false

    if (globalUser?._id) {
      globalConsentMap.set(`id:${String(globalUser._id)}`, consent)
    }

    const normalizedPhone = normalizePhone(globalUser?.phone)
    if (normalizedPhone) {
      globalConsentMap.set(`phone:${normalizedPhone}`, consent)
    }
  })

  return globalConsentMap
}

const applyGlobalConsent = async (users) => {
  const globalConsentMap = await resolveGlobalConsentMap(users)
  if (globalConsentMap.size === 0) {
    return users.map((user) =>
      user && typeof user?.toObject === 'function' ? user.toObject() : user
    )
  }

  return users.map((user) => {
    const plainUser =
      user && typeof user?.toObject === 'function' ? user.toObject() : user

    const globalUserId = String(plainUser?.globalUserId || '').trim()
    const normalizedPhone = normalizePhone(plainUser?.phone)

    const hasConsentById = globalConsentMap.has(`id:${globalUserId}`)
    const hasConsentByPhone = globalConsentMap.has(`phone:${normalizedPhone}`)
    const hasGlobalConsent = hasConsentById || hasConsentByPhone

    const globalConsent = hasConsentById
      ? globalConsentMap.get(`id:${globalUserId}`)
      : hasConsentByPhone
        ? globalConsentMap.get(`phone:${normalizedPhone}`)
        : undefined

    return {
      ...plainUser,
      consentToMailing:
        hasGlobalConsent && typeof globalConsent === 'boolean'
          ? globalConsent
          : Boolean(plainUser?.consentToMailing),
      consentToMailingGlobal:
        hasGlobalConsent && typeof globalConsent === 'boolean'
          ? globalConsent
          : null,
    }
  })
}

export default async function handler(req, res) {
  const props = { select: usersSelect }

  if (req.method !== 'GET') {
    return await CRUD('Users', req, res, props)
  }

  let responseStatus = 200
  let responseJson = null

  const captureRes = {
    status(code) {
      responseStatus = code
      return this
    },
    json(payload) {
      responseJson = payload
      return payload
    },
  }

  await CRUD('Users', req, captureRes, props)

  if (
    !responseJson?.success ||
    !Array.isArray(responseJson?.data) ||
    responseJson.data.length === 0
  ) {
    return res.status(responseStatus).json(responseJson)
  }

  const data = await applyGlobalConsent(responseJson.data)
  return res.status(responseStatus).json({ ...responseJson, data })
}
