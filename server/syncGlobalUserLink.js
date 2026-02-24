import { normalizePhoneValue } from '@helpers/phoneUtils'
import checkLocationValid from './checkLocationValid'
import dbConnectGlobal from '@utils/dbConnectGlobal'
import dbConnect from '@utils/dbConnect'
import { LOCATIONS_KEYS } from './serverConstants'

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

const resolveActivityDate = (user = {}) =>
  toSafeDate(user?.lastActivityAt) ||
  toSafeDate(user?.updatedAt) ||
  toSafeDate(user?.createdAt)

const hasMeaningfulProfile = (profile = {}) =>
  Boolean(
    profile?.firstName ||
      profile?.secondName ||
      profile?.gender ||
      profile?.birthday ||
      (Array.isArray(profile?.images) && profile.images.length > 0)
  )

const resolveMostRecentLocalUserProfileByPhone = async (phone) => {
  const candidates = []
  const phoneString = String(phone)

  for (const location of LOCATIONS_KEYS) {
    const db = await dbConnect(location)
    if (!db) continue
    const localUser = await db
      .model('Users')
      .findOne({ phone: { $in: [phone, phoneString] } })
      .select({
        _id: 1,
        firstName: 1,
        secondName: 1,
        gender: 1,
        birthday: 1,
        images: 1,
        lastActivityAt: 1,
        updatedAt: 1,
        createdAt: 1,
      })
      .lean()

    if (!localUser?._id) continue
    candidates.push({
      location,
      activityAt: resolveActivityDate(localUser),
      profile: normalizeProfile(localUser),
    })
  }

  if (candidates.length === 0) return null

  const sorted = [...candidates].sort((a, b) => {
    const aTs = a.activityAt ? new Date(a.activityAt).getTime() : 0
    const bTs = b.activityAt ? new Date(b.activityAt).getTime() : 0
    return bTs - aTs
  })

  return sorted[0]
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
  const incomingProfile = normalizeProfile(user)
  const cityProfile = {
    userId,
    status: user?.status || 'active',
    role: user?.role || 'client',
    linkedAt: new Date(),
  }
  const existingGlobalUser = await db
    .model('GlobalUsers')
    .findOne({ phone })
    .select({ _id: 1, profile: 1 })
    .lean()

  const preferredLocalProfileData = await resolveMostRecentLocalUserProfileByPhone(phone)
  const preferredProfile =
    preferredLocalProfileData?.profile && hasMeaningfulProfile(preferredLocalProfileData.profile)
      ? preferredLocalProfileData.profile
      : incomingProfile

  const shouldSetProfile = Boolean(
    !existingGlobalUser?._id ||
      !hasMeaningfulProfile(existingGlobalUser?.profile) ||
      !String(source || '').startsWith('vk-auth')
  )

  const setPayload = {
    [`cityProfiles.${location}`]: cityProfile,
  }
  if (shouldSetProfile) {
    setPayload.profile = preferredProfile
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
      $set: setPayload,
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
