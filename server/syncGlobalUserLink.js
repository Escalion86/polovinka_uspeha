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
  const thirdName = String(user?.thirdName || '').trim()
  const email = String(user?.email || '').trim().toLowerCase()
  const ok = String(user?.ok || '').trim()
  const telegram = String(user?.telegram || '').trim()
  const instagram = String(user?.instagram || '').trim()
  const vk = String(user?.vk || '').trim()
  const whatsapp =
    user?.whatsapp === null || typeof user?.whatsapp === 'undefined'
      ? null
      : Number.isFinite(Number(user.whatsapp))
        ? Number(user.whatsapp)
        : null
  const gender = user?.gender || null
  const birthday = toSafeDate(user?.birthday)
  const relationship =
    typeof user?.relationship === 'boolean' ? user.relationship : null
  const haveKids = typeof user?.haveKids === 'boolean' ? user.haveKids : null
  const security =
    user?.security && typeof user.security === 'object'
      ? typeof user.security.toObject === 'function'
        ? user.security.toObject()
        : user.security
      : null
  const images = Array.isArray(user?.images)
    ? user.images.filter(Boolean).slice(0, 12)
    : []

  return {
    firstName,
    secondName,
    thirdName,
    email,
    whatsapp,
    ok,
    telegram,
    instagram,
    vk,
    gender,
    birthday,
    relationship,
    haveKids,
    security,
    images,
  }
}

const normalizeNotifications = (user = {}) => {
  const notifications =
    user?.notifications && typeof user.notifications === 'object'
      ? typeof user.notifications.toObject === 'function'
        ? user.notifications.toObject()
        : user.notifications
      : {}

  const telegramActiveSource = notifications?.telegram?.active

  const consentToMailing =
    typeof user?.consentToMailing === 'boolean' ? user.consentToMailing : false

  return {
    telegramActive:
      typeof telegramActiveSource === 'boolean' ? telegramActiveSource : null,
    consentToMailing,
  }
}

const normalizeAuthProviders = (user = {}) => {
  const telegramIdRaw = user?.notifications?.telegram?.id
  const telegramIdNum = Number(telegramIdRaw)
  const telegramId = Number.isFinite(telegramIdNum) ? telegramIdNum : null

  return {
    telegram: {
      id: telegramId,
    },
  }
}

const normalizeGlobalCore = (user = {}) => {
  const password =
    typeof user?.password === 'string' ? String(user.password).trim() : ''
  const personalStatus = String(user?.personalStatus || '').trim()
  const registrationType = String(user?.registrationType || '').trim() || 'phone'
  const referrerId =
    user?.referrerId === null || typeof user?.referrerId === 'undefined'
      ? null
      : String(user.referrerId).trim() || null
  const lastActivityAt = toSafeDate(user?.lastActivityAt)
  const archive = Boolean(user?.archive)
  const town =
    user?.town === null || typeof user?.town === 'undefined'
      ? null
      : String(user.town).trim() || null

  return {
    password,
    personalStatus,
    registrationType,
    referrerId,
    lastActivityAt,
    archive,
    town,
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
        thirdName: 1,
        email: 1,
        whatsapp: 1,
        ok: 1,
        telegram: 1,
        instagram: 1,
        vk: 1,
        gender: 1,
        relationship: 1,
        haveKids: 1,
        security: 1,
        notifications: 1,
        password: 1,
        personalStatus: 1,
        registrationType: 1,
        referrerId: 1,
        archive: 1,
        town: 1,
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
      notifications: normalizeNotifications(localUser),
      authProviders: normalizeAuthProviders(localUser),
      core: normalizeGlobalCore(localUser),
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
  const incomingNotifications = normalizeNotifications(user)
  const incomingAuthProviders = normalizeAuthProviders(user)
  const incomingCore = normalizeGlobalCore(user)
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
  const preferredNotificationsSource =
    preferredLocalProfileData?.notifications &&
    typeof preferredLocalProfileData.notifications === 'object'
      ? preferredLocalProfileData.notifications
      : {}
  const preferredNotifications = {
    // Глобально храним только согласие на рассылку.
    // Настройки notification.settings остаются локальными (по городу).
    telegramActive:
      typeof incomingNotifications?.telegramActive === 'boolean'
        ? incomingNotifications.telegramActive
        : typeof preferredNotificationsSource?.telegramActive === 'boolean'
          ? preferredNotificationsSource.telegramActive
          : null,
    consentToMailing:
      typeof incomingNotifications?.consentToMailing === 'boolean'
        ? incomingNotifications.consentToMailing
        : typeof preferredNotificationsSource?.consentToMailing === 'boolean'
          ? preferredNotificationsSource.consentToMailing
          : false,
  }
  const preferredAuthProviders =
    preferredLocalProfileData?.authProviders &&
    typeof preferredLocalProfileData.authProviders === 'object'
      ? preferredLocalProfileData.authProviders
      : incomingAuthProviders
  const preferredCore =
    preferredLocalProfileData?.core &&
    typeof preferredLocalProfileData.core === 'object'
      ? preferredLocalProfileData.core
      : incomingCore

  const shouldSetProfile = Boolean(
    !existingGlobalUser?._id ||
      !hasMeaningfulProfile(existingGlobalUser?.profile) ||
      !String(source || '').startsWith('vk-auth')
  )

  const setPayload = {
    [`cityProfiles.${location}`]: cityProfile,
    notifications: {
      consentToMailing: preferredNotifications.consentToMailing,
    },
    password: preferredCore.password,
    personalStatus: preferredCore.personalStatus,
    registrationType: preferredCore.registrationType,
    referrerId: preferredCore.referrerId,
    lastActivityAt: preferredCore.lastActivityAt,
    archive: preferredCore.archive,
    town: preferredCore.town,
  }
  if (shouldSetProfile) {
    setPayload.profile = preferredProfile
  }
  if (Number.isFinite(Number(preferredAuthProviders?.telegram?.id))) {
    setPayload['authProviders.telegram.id'] = Number(
      preferredAuthProviders.telegram.id
    )
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
      returnDocument: 'after',
      upsert: true,
      setDefaultsOnInsert: true,
    }
  )

  if (updated?._id) {
    try {
      const localDb = await dbConnect(location)
      if (localDb) {
        await localDb.model('Users').findByIdAndUpdate(userId, {
          $set: { globalUserId: String(updated._id) },
        })
      }
    } catch (error) {
      console.log('syncGlobalUserLink local globalUserId set error:', error)
    }
  }

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
