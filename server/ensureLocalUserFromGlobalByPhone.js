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
  const gender = profile?.gender || null
  const birthday = profile?.birthday ? new Date(profile.birthday) : null
  const images = Array.isArray(profile?.images)
    ? profile.images.filter(Boolean).slice(0, 12)
    : []

  return {
    firstName,
    secondName,
    gender,
    birthday: birthday && !Number.isNaN(birthday.getTime()) ? birthday : null,
    images,
  }
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

  const localExisting = await db.model('Users').findOne({ phone: phoneNumber }).lean()
  if (localExisting?._id) {
    return {
      success: true,
      data: {
        globalUserFound: false,
        localUser: localExisting,
        localUserCreated: false,
      },
    }
  }

  const globalDb = await dbConnectGlobal()
  if (!globalDb) {
    return {
      success: true,
      data: {
        globalUserFound: false,
        localUser: null,
        localUserCreated: false,
      },
    }
  }

  const globalUser = await globalDb
    .model('GlobalUsers')
    .findOne({ phone: phoneNumber })
    .lean()
  if (!globalUser?._id) {
    return {
      success: true,
      data: {
        globalUserFound: false,
        localUser: null,
        localUserCreated: false,
      },
    }
  }

  const cityProfiles = toPlainObject(globalUser?.cityProfiles)
  const locationProfile = cityProfiles?.[location] || {}
  const preparedProfile = normalizeGlobalProfile(globalUser?.profile)

  const newLocalUser = await db.model('Users').create({
    phone: phoneNumber,
    firstName: preparedProfile.firstName,
    secondName: preparedProfile.secondName,
    gender: preparedProfile.gender,
    birthday: preparedProfile.birthday,
    images: preparedProfile.images,
    role: locationProfile?.role || 'client',
    status: locationProfile?.status || 'active',
    registrationType: 'global-link',
    authProviders: ['global-link'],
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
