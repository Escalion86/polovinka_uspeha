import dbConnect from '@utils/dbConnect'
import dbConnectGlobal from '@utils/dbConnectGlobal'
import checkLocationValid from './checkLocationValid'
import { normalizePhoneValue } from '@helpers/phoneUtils'
import { isGlobalUsersReadEnabled } from './globalUsersRuntimeConfig.mjs'

const normalizePhoneNumber = (rawPhone) => {
  const normalized = normalizePhoneValue(rawPhone)
  if (!normalized) return null
  const asNumber = Number(normalized)
  return Number.isFinite(asNumber) ? asNumber : null
}

const toPlainObject = (value) => {
  if (!value) return {}
  if (typeof value.toObject === 'function') return value.toObject()
  if (typeof value === 'object') return value
  return {}
}

const resolvePasswordFromGlobalByPhone = async ({ phone, location }) => {
  const phoneNumber = normalizePhoneNumber(phone)
  if (!phoneNumber || !checkLocationValid(location)) return null
  if (!isGlobalUsersReadEnabled(location)) return null

  const globalDb = await dbConnectGlobal()
  if (!globalDb) return null

  const globalUser = await globalDb
    .model('GlobalUsers')
    .findOne({ phone: phoneNumber })
    .lean()
  if (!globalUser?._id) return null

  const cityProfiles = toPlainObject(globalUser.cityProfiles)
  const cityEntries = Object.entries(cityProfiles).filter(
    ([city, profile]) => city !== location && checkLocationValid(city) && profile?.userId
  )

  for (const [city, profile] of cityEntries) {
    try {
      const cityDb = await dbConnect(city)
      if (!cityDb) continue
      const user = await cityDb
        .model('Users')
        .findById(profile.userId)
        .select({ password: 1, phone: 1, globalUserId: 1 })
        .lean()

      if (
        normalizePhoneNumber(user?.phone) === phoneNumber &&
        (!user?.globalUserId || String(user.globalUserId) === String(globalUser._id)) &&
        user?.password && typeof user.password === 'string'
      ) {
        return user.password
      }
    } catch (error) {
      console.log('resolvePasswordFromGlobalByPhone city check error:', {
        city,
        userId: profile?.userId,
        error,
      })
    }
  }

  if (globalUser?.password && typeof globalUser.password === 'string') {
    return globalUser.password
  }

  return null
}

export default resolvePasswordFromGlobalByPhone
