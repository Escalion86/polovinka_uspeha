import { normalizePhoneValue } from '@helpers/phoneUtils'
import checkLocationValid from './checkLocationValid'
import dbConnectGlobal from '@utils/dbConnectGlobal'

const toSafeDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const normalizeProfile = (user = {}) => {
  const firstName = String(user?.firstName || '').trim()
  const secondName = String(user?.secondName || '').trim()
  const gender = user?.gender || null
  const birthday = toSafeDate(user?.birthday)
  const images = Array.isArray(user?.images)
    ? user.images.filter(Boolean).slice(0, 12)
    : []

  return {
    firstName,
    secondName,
    gender,
    birthday,
    images,
  }
}

const resolvePhone = (value) => {
  const normalized = normalizePhoneValue(value)
  if (!normalized) return null
  const asNumber = Number(normalized)
  return Number.isFinite(asNumber) ? asNumber : null
}

const syncGlobalUserLink = async ({ location, user, source = 'vk-auth' }) => {
  if (!checkLocationValid(location) || !user?._id) {
    return {
      success: false,
      data: {
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Location or user is invalid for global sync',
        },
      },
    }
  }

  const phone = resolvePhone(user.phone)
  if (!phone) {
    return {
      success: false,
      data: {
        error: {
          type: 'PHONE_REQUIRED',
          message: 'Global user link requires a valid phone',
        },
      },
    }
  }

  const db = await dbConnectGlobal()
  if (!db) {
    return {
      success: false,
      data: {
        error: {
          type: 'DB_ERROR',
          message: 'Global DB connection failed',
        },
      },
    }
  }

  const userId = String(user._id)
  const profile = normalizeProfile(user)
  const cityProfile = {
    userId,
    status: user?.status || 'active',
    role: user?.role || 'client',
    linkedAt: new Date(),
  }

  const updated = await db.model('GlobalUsers').findOneAndUpdate(
    { phone },
    {
      $setOnInsert: {
        phone,
        meta: {
          source,
          version: 1,
        },
      },
      $set: {
        profile,
        [`cityProfiles.${location}`]: cityProfile,
      },
      $addToSet: {
        cities: location,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  )

  return {
    success: true,
    data: {
      phone,
      location,
      globalUserId: updated?._id ? String(updated._id) : null,
    },
  }
}

export default syncGlobalUserLink
