import checkLocationValid from './checkLocationValid'
import dbConnectGlobal from '@utils/dbConnectGlobal'
import { normalizePhoneValue } from '@helpers/phoneUtils'

const normalizePhoneNumber = (rawPhone) => {
  const normalized = normalizePhoneValue(rawPhone)
  if (!normalized) return null
  const asNumber = Number(normalized)
  return Number.isFinite(asNumber) ? asNumber : null
}

const normalizeGlobalProfile = (profile = {}) => {
  const firstName = String(profile?.firstName || '').trim()
  const secondName = String(profile?.secondName || '').trim()
  const thirdName = String(profile?.thirdName || '').trim()
  const email = String(profile?.email || '').trim().toLowerCase()
  const ok = String(profile?.ok || '').trim()
  const telegram = String(profile?.telegram || '').trim()
  const instagram = String(profile?.instagram || '').trim()
  const vk = String(profile?.vk || '').trim()
  const whatsapp =
    profile?.whatsapp === null || typeof profile?.whatsapp === 'undefined'
      ? null
      : Number.isFinite(Number(profile.whatsapp))
        ? Number(profile.whatsapp)
        : null
  const gender = profile?.gender || null
  const birthday = profile?.birthday ? new Date(profile.birthday) : null
  const relationship =
    typeof profile?.relationship === 'boolean' ? profile.relationship : null
  const haveKids = typeof profile?.haveKids === 'boolean' ? profile.haveKids : null
  const security =
    profile?.security && typeof profile.security === 'object'
      ? profile.security
      : null
  const images = Array.isArray(profile?.images)
    ? profile.images.filter(Boolean).slice(0, 12)
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
    birthday: birthday && !Number.isNaN(birthday.getTime()) ? birthday : null,
    relationship,
    haveKids,
    security,
    images,
  }
}

const normalizeGlobalCore = (globalUser = {}) => {
  const password =
    typeof globalUser?.password === 'string' ? String(globalUser.password).trim() : ''
  const personalStatus = String(globalUser?.personalStatus || '').trim()
  const registrationType =
    String(globalUser?.registrationType || '').trim() || 'phone'
  const referrerId =
    globalUser?.referrerId === null || typeof globalUser?.referrerId === 'undefined'
      ? null
      : String(globalUser.referrerId).trim() || null
  const lastActivityAt = globalUser?.lastActivityAt
    ? new Date(globalUser.lastActivityAt)
    : null
  const archive = Boolean(globalUser?.archive)
  const town =
    globalUser?.town === null || typeof globalUser?.town === 'undefined'
      ? null
      : String(globalUser.town).trim() || null

  return {
    password,
    personalStatus,
    registrationType,
    referrerId,
    lastActivityAt:
      lastActivityAt && !Number.isNaN(lastActivityAt.getTime())
        ? lastActivityAt
        : null,
    archive,
    town,
  }
}

const normalizeGlobalNotifications = (globalUser = {}) => {
  const notifications =
    globalUser?.notifications && typeof globalUser.notifications === 'object'
      ? globalUser.notifications
      : {}
  const consentToMailing =
    typeof notifications?.consentToMailing === 'boolean'
      ? notifications.consentToMailing
      : false

  return {
    consentToMailing,
  }
}

const toPatchFromGlobalProfile = (profile = {}) => {
  const patch = {}

  if (profile.firstName) patch.firstName = profile.firstName
  if (profile.secondName) patch.secondName = profile.secondName
  if (profile.thirdName) patch.thirdName = profile.thirdName
  if (profile.email) patch.email = profile.email
  if (typeof profile.whatsapp === 'number') patch.whatsapp = profile.whatsapp
  if (profile.ok) patch.ok = profile.ok
  if (profile.telegram) patch.telegram = profile.telegram
  if (profile.instagram) patch.instagram = profile.instagram
  if (profile.vk) patch.vk = profile.vk
  if (profile.gender) patch.gender = profile.gender
  if (profile.birthday) patch.birthday = profile.birthday
  if (typeof profile.relationship === 'boolean') {
    patch.relationship = profile.relationship
  }
  if (typeof profile.haveKids === 'boolean') patch.haveKids = profile.haveKids
  if (profile.security && typeof profile.security === 'object') {
    patch.security = profile.security
  }
  if (Array.isArray(profile.images) && profile.images.length > 0) {
    patch.images = profile.images
  }

  return patch
}

const toPatchFromGlobalCore = (core = {}) => {
  const patch = {}

  if (core.password) patch.password = core.password
  if (core.personalStatus) patch.personalStatus = core.personalStatus
  if (core.registrationType) patch.registrationType = core.registrationType
  if (core.referrerId) patch.referrerId = core.referrerId
  if (core.lastActivityAt) patch.lastActivityAt = core.lastActivityAt
  if (typeof core.archive === 'boolean') patch.archive = core.archive
  if (core.town) patch.town = core.town

  return patch
}

const toPatchFromGlobalNotifications = (notifications = {}) => {
  const patch = {}
  if (typeof notifications.consentToMailing === 'boolean') {
    patch.consentToMailing = notifications.consentToMailing
  }
  return patch
}

const toPlainObject = (value) => {
  if (!value) return {}
  if (typeof value.toObject === 'function') return value.toObject()
  if (typeof value === 'object') return value
  return {}
}

const ensureLocalUserFromGlobalByPhone = async ({
  db,
  location,
  phone,
  source = 'global-read',
}) => {
  if (!db || !checkLocationValid(location)) {
    return {
      success: false,
      data: {
        error: {
          type: 'VALIDATION_ERROR',
          message: 'db or location is invalid',
        },
      },
    }
  }

  const phoneNumber = normalizePhoneNumber(phone)
  if (!phoneNumber) {
    return {
      success: false,
      data: {
        error: {
          type: 'PHONE_INVALID',
          message: 'Phone is invalid',
        },
      },
    }
  }

  const globalDb = await dbConnectGlobal()
  if (!globalDb) {
    const localExistingNoGlobal = await db
      .model('Users')
      .findOne({ phone: phoneNumber })
      .lean()
    return {
      success: true,
      data: {
        globalUserFound: false,
        localUser: localExistingNoGlobal || null,
        localUserCreated: false,
      },
    }
  }

  const globalUser = await globalDb
    .model('GlobalUsers')
    .findOne({ phone: phoneNumber })
    .lean()
  if (!globalUser?._id) {
    const localExistingNoGlobal = await db
      .model('Users')
      .findOne({ phone: phoneNumber })
      .lean()
    return {
      success: true,
      data: {
        globalUserFound: false,
        localUser: localExistingNoGlobal || null,
        localUserCreated: false,
      },
    }
  }

  const cityProfiles = toPlainObject(globalUser?.cityProfiles)
  const locationProfile = cityProfiles?.[location] || {}
  const preparedProfile = normalizeGlobalProfile(globalUser?.profile)
  const preparedCore = normalizeGlobalCore(globalUser)
  const preparedNotifications = normalizeGlobalNotifications(globalUser)
  const localExisting = await db.model('Users').findOne({ phone: phoneNumber }).lean()
  if (localExisting?._id) {
    const patch = {
      ...toPatchFromGlobalProfile(preparedProfile),
      ...toPatchFromGlobalCore(preparedCore),
      ...toPatchFromGlobalNotifications(preparedNotifications),
    }
    const hasPatch = Object.keys(patch).length > 0
    const updatedExisting =
      hasPatch
        ? await db
            .model('Users')
            .findByIdAndUpdate(localExisting._id, { $set: patch }, { new: true })
            .lean()
        : localExisting

    await globalDb.model('GlobalUsers').findOneAndUpdate(
      { phone: phoneNumber },
      {
        $set: {
          [`cityProfiles.${location}`]: {
            userId: String(localExisting._id),
            status: localExisting?.status || locationProfile?.status || 'active',
            role: localExisting?.role || locationProfile?.role || 'client',
            linkedAt: new Date(),
          },
          meta: {
            source,
            version: 1,
          },
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
        globalUserFound: true,
        localUser: updatedExisting,
        localUserCreated: false,
      },
    }
  }

  const newLocalUser = await db.model('Users').create({
    phone: phoneNumber,
    ...(preparedCore.password ? { password: preparedCore.password } : {}),
    firstName: preparedProfile.firstName,
    secondName: preparedProfile.secondName,
    thirdName: preparedProfile.thirdName,
    email: preparedProfile.email,
    whatsapp: preparedProfile.whatsapp,
    ok: preparedProfile.ok,
    telegram: preparedProfile.telegram,
    instagram: preparedProfile.instagram,
    vk: preparedProfile.vk,
    gender: preparedProfile.gender,
    birthday: preparedProfile.birthday,
    relationship: preparedProfile.relationship,
    haveKids: preparedProfile.haveKids,
    ...(preparedProfile.security && typeof preparedProfile.security === 'object'
      ? { security: preparedProfile.security }
      : {}),
    images: preparedProfile.images,
    role: locationProfile?.role || 'client',
    status: locationProfile?.status || 'active',
    registrationType: preparedCore.registrationType || 'global-link',
    authProviders: ['global-link'],
    ...(preparedCore.referrerId ? { referrerId: preparedCore.referrerId } : {}),
    ...(preparedCore.town ? { town: preparedCore.town } : {}),
    ...(preparedCore.personalStatus
      ? { personalStatus: preparedCore.personalStatus }
      : {}),
    ...(preparedCore.lastActivityAt
      ? { lastActivityAt: preparedCore.lastActivityAt }
      : {}),
    archive: preparedCore.archive,
    consentToMailing: preparedNotifications.consentToMailing,
  })

  await db.model('Histories').create({
    schema: 'users',
    action: 'add',
    data: newLocalUser,
    userId: newLocalUser._id,
  })

  await globalDb.model('GlobalUsers').findOneAndUpdate(
    { phone: phoneNumber },
    {
      $set: {
        [`cityProfiles.${location}`]: {
          userId: String(newLocalUser._id),
          status: locationProfile?.status || 'active',
          role: locationProfile?.role || 'client',
          linkedAt: new Date(),
        },
        meta: {
          source,
          version: 1,
        },
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
      globalUserFound: true,
      localUser: newLocalUser.toJSON ? newLocalUser.toJSON() : newLocalUser,
      localUserCreated: true,
    },
  }
}

export default ensureLocalUserFromGlobalByPhone
