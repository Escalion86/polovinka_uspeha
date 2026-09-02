import CredentialsProvider from 'next-auth/providers/credentials'
import mongoose from 'mongoose'
import dbConnect from '@utils/dbConnect'
import createReferralRegistrationCoupon from '@server/createReferralRegistrationCoupon'
import userRegisterTelegramNotification from '@server/userRegisterTelegramNotification'
import {
  hashPassword,
  shouldRehashPassword,
  verifyPassword,
} from '@helpers/passwordUtils'
import parseBooleanFromInput from '@helpers/parseBooleanFromInput'
import ensureConsentToMailingField from '@server/ensureConsentToMailingField'
import assertCityOperationAllowed from '@server/assertCityOperationAllowed'
import dbConnectGlobal from '@utils/dbConnectGlobal'
import {
  isAuthDevOnlyModeEnabled,
  isAuthDevOnlyUserAllowed,
} from '@server/authDevOnlyMode'
import { normalizePhoneValue } from '@helpers/phoneUtils'
import { exchangeVkCode, fetchVkUserInfo } from './vkIdAuth'
import syncGlobalUserLink from './syncGlobalUserLink'
import ensureLocalUserFromGlobalByPhone from './ensureLocalUserFromGlobalByPhone'
import resolvePasswordFromGlobalByPhone from './resolvePasswordFromGlobalByPhone'
import { isGlobalUsersReadEnabled } from './globalUsersRuntimeConfig.mjs'
import checkLocationValid from './checkLocationValid'

const AUTH_JWT_SECRET = process.env.SECRET || 'test'

const parsePhoneNumber = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const digitsOnly = trimmed.replace(/\D/g, '')
    if (!digitsOnly) return null

    const parsed = Number(digitsOnly)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

const normalizePhoneDigits = (value) => {
  if (!value) return null
  const digitsOnly = String(value).replace(/\D/g, '')
  if (!digitsOnly) return null
  if (digitsOnly.length === 10) return `7${digitsOnly}`
  if (digitsOnly.length === 11) {
    if (digitsOnly[0] === '8') return `7${digitsOnly.slice(1)}`
    if (digitsOnly[0] === '7') return digitsOnly
  }
  return digitsOnly
}

const resolveReferrerId = async (db, referrerId) => {
  if (!referrerId || !mongoose.Types.ObjectId.isValid(referrerId)) return null

  const referrer = await db
    .model('Users')
    .findById(referrerId)
    .select({ _id: 1 })
    .lean()

  return referrer?._id ?? null
}

const normalizeVkId = (value) => {
  const normalized = String(value ?? '').trim()
  if (!normalized) return null

  return `id${normalized.replace(/^id/i, '')}`
}

const getVkIdCandidates = (vkId) => {
  if (!vkId) return []

  const legacyVkId = vkId.replace(/^id/i, '')
  return legacyVkId === vkId ? [vkId] : [vkId, legacyVkId]
}

const buildVkProfilePatch = ({ vkUser = {}, vkId, consentToMailing }) => {
  const firstName = String(vkUser?.first_name ?? '').trim()
  const secondName = String(vkUser?.last_name ?? '').trim()
  const thirdName = String(vkUser?.middle_name ?? '').trim()
  const email = String(vkUser?.email ?? '').trim().toLowerCase()
  const avatar = String(vkUser?.avatar ?? '').trim()

  return {
    ...(vkId ? { vk: vkId } : {}),
    ...(firstName ? { firstName } : {}),
    ...(secondName ? { secondName } : {}),
    ...(thirdName ? { thirdName } : {}),
    ...(email ? { email } : {}),
    ...(avatar ? { images: [avatar] } : {}),
    ...(typeof consentToMailing === 'boolean' ? { consentToMailing } : {}),
  }
}

const buildVkSetForExistingUser = ({ existingUser = {}, vkProfilePatch = {} }) => {
  const nextSet = {}

  if (
    vkProfilePatch.vk &&
    (!existingUser.vk || normalizeVkId(existingUser.vk) === vkProfilePatch.vk)
  ) {
    nextSet.vk = vkProfilePatch.vk
  }
  if (vkProfilePatch.firstName && !existingUser.firstName) {
    nextSet.firstName = vkProfilePatch.firstName
  }
  if (vkProfilePatch.secondName && !existingUser.secondName) {
    nextSet.secondName = vkProfilePatch.secondName
  }
  if (vkProfilePatch.thirdName && !existingUser.thirdName) {
    nextSet.thirdName = vkProfilePatch.thirdName
  }
  if (vkProfilePatch.email && !existingUser.email) {
    nextSet.email = vkProfilePatch.email
  }
  if (
    Array.isArray(vkProfilePatch.images) &&
    vkProfilePatch.images.length > 0 &&
    (!Array.isArray(existingUser.images) || existingUser.images.length === 0)
  ) {
    nextSet.images = vkProfilePatch.images
  }

  if (
    typeof vkProfilePatch.consentToMailing === 'boolean' &&
    typeof existingUser.consentToMailing !== 'boolean'
  ) {
    nextSet.consentToMailing = vkProfilePatch.consentToMailing
  }

  return nextSet
}

const getPhoneCandidates = (phoneRaw) => {
  const normalized = normalizePhoneValue(phoneRaw)
  if (!normalized) return []
  const normalizedNum = Number(normalized)
  return Number.isFinite(normalizedNum)
    ? [normalizedNum, normalized]
    : [normalized]
}

const parseAttributionInput = (value) => {
  if (!value) return null
  if (typeof value === 'object') return value
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

const toPlainObject = (value) => {
  if (value === null || typeof value === 'undefined') return value
  if (value instanceof Map) {
    return Array.from(value.entries()).reduce((acc, [key, mapValue]) => {
      acc[key] = toPlainObject(mapValue)
      return acc
    }, {})
  }
  if (Array.isArray(value)) return value.map((item) => toPlainObject(item))
  if (value instanceof Date) return value
  if (typeof value.toObject === 'function') return toPlainObject(value.toObject())
  if (typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, objectValue]) => {
      acc[key] = toPlainObject(objectValue)
      return acc
    }, {})
  }
  return value
}

const normalizeNotificationSettings = (source = {}) => {
  const settingsSource =
    source && typeof source === 'object' && source.settings && typeof source.settings === 'object'
      ? source.settings
      : {}
  const settings = { ...settingsSource }
  if (
    typeof settings.newEvents !== 'boolean' &&
    typeof settings.newEventsByTags === 'boolean'
  ) {
    settings.newEvents = settings.newEventsByTags
  }
  delete settings.newEventsByTags
  return settings
}

const readGlobalUserByPhone = async (phone) => {
  const normalized = normalizePhoneValue(phone)
  if (!normalized) return null
  const phoneNumber = Number(normalized)
  if (!Number.isFinite(phoneNumber)) return null

  const globalDb = await dbConnectGlobal()
  if (!globalDb) return null

  const doc = await globalDb
    .model('GlobalUsers')
    .findOne({ phone: phoneNumber })
    .select({
      profile: 1,
      cityProfiles: 1,
      cities: 1,
      personalStatus: 1,
      registrationType: 1,
      referrerId: 1,
      lastActivityAt: 1,
      archive: 1,
      town: 1,
      notifications: 1,
    })
    .lean()
  return doc?._id ? doc : null
}

const readGlobalUserById = async (globalUserId) => {
  const id = String(globalUserId || '').trim()
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null

  const globalDb = await dbConnectGlobal()
  if (!globalDb) return null

  const doc = await globalDb
    .model('GlobalUsers')
    .findById(id)
    .select({
      profile: 1,
      cities: 1,
      personalStatus: 1,
      registrationType: 1,
      referrerId: 1,
      lastActivityAt: 1,
      archive: 1,
      town: 1,
      notifications: 1,
    })
    .lean()
  return doc?._id ? doc : null
}

const readGlobalUserByTelegramId = async (telegramId) => {
  const telegramIdNum = Number(telegramId)
  if (!Number.isFinite(telegramIdNum)) return null

  const globalDb = await dbConnectGlobal()
  if (!globalDb) return null

  const doc = await globalDb
    .model('GlobalUsers')
    .findOne({ 'authProviders.telegram.id': telegramIdNum })
    .select({ phone: 1, cityProfiles: 1, authProviders: 1, notifications: 1 })
    .lean()

  return doc?._id ? doc : null
}

const resolveGlobalFirst = (globalValue, localValue) => {
  if (typeof globalValue === 'boolean') return globalValue
  if (typeof globalValue === 'number') return globalValue
  if (globalValue instanceof Date) return globalValue
  if (Array.isArray(globalValue)) return globalValue.length > 0 ? globalValue : localValue
  if (globalValue && typeof globalValue === 'object') {
    return Object.keys(globalValue).length > 0 ? globalValue : localValue
  }
  if (typeof globalValue === 'string') {
    return globalValue.trim() ? globalValue : localValue
  }
  return localValue
}

const syncGlobalLinkSafe = async ({ location, user, source }) => {
  try {
    const result = await syncGlobalUserLink({ location, user, source })
    if (!result?.success) {
      console.log('syncGlobalUserLink skipped:', result?.data?.error)
    }
  } catch (error) {
    console.log('syncGlobalUserLink error:', error)
  }
}

const throwVkAuthError = (code) => {
  throw new Error(code)
}

const isVkDebugLogsEnabled = () =>
  String(process.env.VK_DEBUG_LOGS || '')
    .trim()
    .toLowerCase() === 'true'

const isVkAuthTestModeEnabled = () =>
  String(process.env.VK_AUTH_TEST_MODE || '')
    .trim()
    .toLowerCase() === 'true'

const isVkAuthTestRequest = (value) =>
  parseBooleanFromInput(value) && isVkAuthTestModeEnabled()

const buildVkTestUser = ({ phone, location }) => {
  const normalizedPhone = normalizePhoneValue(phone)
  if (!normalizedPhone) return null

  return {
    user_id: `test-${location}-${normalizedPhone}`,
    phone: normalizedPhone,
    first_name: 'VK Test',
    last_name: normalizedPhone.slice(-4),
  }
}

const logVkDebug = (label, payload) => {
  if (!isVkDebugLogsEnabled()) return
  console.log(`[VK DEBUG] ${label}:`, payload)
}

const maskPhoneForLog = (value) => {
  const digits = normalizePhoneDigits(value)
  if (!digits) return null
  const tail = digits.slice(-4)
  return `***${tail}`
}

const buildSessionPayload = (user, location) => ({
  name: user?._id,
  email: location,
  role: user?.role,
  phone: user?.phone,
})

const isUserAuthBlocked = (user) => user?.status === 'ban'

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },
        location: { label: 'Location', type: 'text' },
      },
      authorize: async (credentials) => {
        const { phone, password, location } = credentials ?? {}
        if (phone && password && location) {
          const loginGuard = await assertCityOperationAllowed(location, 'login')
          if (!loginGuard.success) {
            return null
          }

          const db = await dbConnect(location)
          if (!db) return null
          await ensureConsentToMailingField(db, location)

          const globalReadResult = await ensureLocalUserFromGlobalByPhone({
            db,
            location,
            phone,
            source: 'login-read',
          })

          if (!globalReadResult?.success) return null
          let fetchedUser = globalReadResult.data?.localUser

          if (fetchedUser?._id && !fetchedUser?.password) {
            const globalPasswordHash = await resolvePasswordFromGlobalByPhone({
              phone,
              location,
            })
            if (globalPasswordHash) {
              await db.model('Users').findByIdAndUpdate(fetchedUser._id, {
                password: globalPasswordHash,
              })
              fetchedUser = {
                ...fetchedUser,
                password: globalPasswordHash,
              }
            }
          }

          if (!fetchedUser?.password) return null
          if (!isAuthDevOnlyUserAllowed(fetchedUser, phone)) return null
          if (isUserAuthBlocked(fetchedUser)) return null

          const passwordIsValid = await verifyPassword(
            password,
            fetchedUser.password
          )

          if (!passwordIsValid) {
            return null
          }

          if (shouldRehashPassword(fetchedUser.password)) {
            const newPasswordHash = await hashPassword(password)
            await db.model('Users').findByIdAndUpdate(fetchedUser._id, {
              password: newPasswordHash,
            })
          }
          await syncGlobalLinkSafe({
            location,
            user: fetchedUser,
            source: 'credentials-login',
          })

          return buildSessionPayload(fetchedUser, location)
        }

        return null
      },
    }),
    CredentialsProvider({
      id: 'vk',
      name: 'vk',
      credentials: {
        code: { label: 'Code', type: 'text' },
        deviceId: { label: 'DeviceId', type: 'text' },
        accessToken: { label: 'AccessToken', type: 'text' },
        location: { label: 'Location', type: 'text' },
        mode: { label: 'Mode', type: 'text' },
        state: { label: 'State', type: 'text' },
        codeVerifier: { label: 'CodeVerifier', type: 'text' },
        referrerId: { label: 'ReferrerId', type: 'text' },
        consentToMailing: { label: 'consentToMailing', type: 'text' },
        attribution: { label: 'Attribution', type: 'text' },
        vkAuthTest: { label: 'vkAuthTest', type: 'text' },
        vkAuthTestPhone: { label: 'vkAuthTestPhone', type: 'text' },
        isAdultConfirmed: { label: 'isAdultConfirmed', type: 'text' },
        personalDataAgreementAccepted: {
          label: 'personalDataAgreementAccepted',
          type: 'text',
        },
      },
      authorize: async (credentials) => {
        const {
          code,
          deviceId,
          accessToken: accessTokenFromClient,
          location,
          mode,
          state,
          codeVerifier,
          referrerId,
          consentToMailing: consentToMailingRaw,
          attribution: attributionRaw,
          vkAuthTest,
          vkAuthTestPhone,
          isAdultConfirmed: isAdultConfirmedRaw,
          personalDataAgreementAccepted: personalDataAgreementAcceptedRaw,
        } = credentials ?? {}

        const isVkTestRequest = isVkAuthTestRequest(vkAuthTest)

        if (!isVkTestRequest && (!code || !deviceId) && !accessTokenFromClient) {
          throwVkAuthError('VK_BAD_REQUEST')
        }
        if (!location) {
          throwVkAuthError('VK_BAD_REQUEST')
        }

        const loginGuard = await assertCityOperationAllowed(location, 'login')
        if (!loginGuard.success) {
          throwVkAuthError('VK_LOGIN_BLOCKED')
        }
        const vkAuthGuard = await assertCityOperationAllowed(location, 'vk_auth')
        if (!vkAuthGuard.success) {
          throwVkAuthError('VK_AUTH_DISABLED')
        }

        let exchangeResult = null
        const accessToken = accessTokenFromClient
          ? String(accessTokenFromClient)
          : null

        if (!isVkTestRequest && !accessToken) {
          exchangeResult = await exchangeVkCode({
            code,
            deviceId,
            codeVerifier,
            state,
          })
          logVkDebug('exchangeVkCode response', exchangeResult)
          if (!exchangeResult.success) {
            console.log('VK exchange error:', exchangeResult?.data)
            throwVkAuthError('VK_EXCHANGE_FAILED')
          }
        } else {
          logVkDebug('exchange skipped (accessToken from client)', {
            hasAccessToken: Boolean(accessToken),
            isVkTestRequest,
          })
        }

        const resolvedAccessToken = accessToken || exchangeResult?.data?.access_token
        if (!isVkTestRequest && !resolvedAccessToken) {
          throwVkAuthError('VK_EXCHANGE_FAILED')
        }

        const userInfoResult = isVkTestRequest
          ? {
              success: true,
              data: {
                user: buildVkTestUser({
                  phone: vkAuthTestPhone,
                  location,
                }),
              },
            }
          : await fetchVkUserInfo({
              accessToken: resolvedAccessToken,
            })
        logVkDebug('fetchVkUserInfo response', userInfoResult)
        if (!userInfoResult.success) {
          console.log('VK userInfo error:', userInfoResult?.data)
          throwVkAuthError('VK_USERINFO_FAILED')
        }

        const vkUser = userInfoResult?.data?.user || {}
        const vkId =
          normalizeVkId(vkUser?.user_id) ||
          normalizeVkId(exchangeResult?.data?.user_id)
        logVkDebug('vk profile parsed', {
          mode: String(mode || '').trim() || 'login',
          location,
          vkId,
          vkPhoneMasked: maskPhoneForLog(vkUser?.phone),
        })
        if (!vkId) {
          throwVkAuthError('VK_PROFILE_INVALID')
        }

        const db = await dbConnect(location)
        if (!db) {
          throwVkAuthError('VK_SERVER_UNAVAILABLE')
        }
        await ensureConsentToMailingField(db, location)

        const usersModel = db.model('Users')
        const consentToMailing =
          typeof consentToMailingRaw === 'undefined'
            ? undefined
            : parseBooleanFromInput(consentToMailingRaw)
        const isAdultConfirmed = parseBooleanFromInput(isAdultConfirmedRaw)
        const personalDataAgreementAccepted = parseBooleanFromInput(
          personalDataAgreementAcceptedRaw
        )
        const attribution = parseAttributionInput(attributionRaw)
        const isVkRegisterMode = String(mode || '').trim() === 'register'
        const vkProfilePatch = buildVkProfilePatch({
          vkUser,
          vkId,
          consentToMailing,
        })
        const phoneCandidates = getPhoneCandidates(vkUser?.phone)
        logVkDebug('vk phone candidates', {
          count: phoneCandidates.length,
          firstMasked: maskPhoneForLog(phoneCandidates[0]),
        })
        if (phoneCandidates.length === 0) {
          console.log('VK auth: phone is required for global link login')
          throwVkAuthError('VK_PHONE_REQUIRED')
        }

        const phoneValueToSet =
          phoneCandidates.length > 0 && Number.isFinite(Number(phoneCandidates[0]))
            ? Number(phoneCandidates[0])
            : null
        const globalReadResult = await ensureLocalUserFromGlobalByPhone({
          db,
          location,
          phone: phoneCandidates[0],
          source: 'vk-global-phone-read',
          createIfMissing: isVkRegisterMode,
        })
        if (!globalReadResult?.success) {
          throwVkAuthError('VK_SERVER_UNAVAILABLE')
        }
        logVkDebug('vk global resolve result', {
          isVkRegisterMode,
          success: Boolean(globalReadResult?.success),
          globalUserFound: Boolean(globalReadResult?.data?.globalUserFound),
          localUserId: globalReadResult?.data?.localUser?._id
            ? String(globalReadResult.data.localUser._id)
            : null,
          localUserCreated: Boolean(globalReadResult?.data?.localUserCreated),
        })

        const globalLocalUser = globalReadResult?.data?.localUser || null
        if (globalLocalUser?._id) {
          if (isUserAuthBlocked(globalLocalUser)) {
            throwVkAuthError('VK_AUTH_BLOCKED')
          }
          if (!isAuthDevOnlyUserAllowed(globalLocalUser, phoneValueToSet)) {
            throwVkAuthError('VK_DEV_ONLY_MODE')
          }

          const vkSetForExistingUser = buildVkSetForExistingUser({
            existingUser: globalLocalUser,
            vkProfilePatch,
          })

          const updatedUser = await usersModel.findByIdAndUpdate(
            globalLocalUser._id,
            {
              $set: {
                ...vkSetForExistingUser,
                registrationType: globalLocalUser.registrationType || 'vk',
                ...(globalLocalUser.phone || !phoneValueToSet
                  ? {}
                  : { phone: phoneValueToSet }),
              },
              $addToSet: {
                authProviders: 'vk',
              },
            },
            { returnDocument: 'after', lean: true }
          )

          const userByVkId = await usersModel
            .findOne({
              _id: { $ne: globalLocalUser._id },
              vk: { $in: getVkIdCandidates(vkId) },
            })
            .select({ _id: 1 })
            .lean()
          if (userByVkId?._id) {
            await usersModel.findByIdAndUpdate(userByVkId._id, {
              $unset: { vk: '' },
            })
          }

          await syncGlobalLinkSafe({
            location,
            user: updatedUser || globalLocalUser,
            source: 'vk-auth-global-link',
          })

          return buildSessionPayload(updatedUser || globalLocalUser, location)
        }

        if (
          !globalReadResult?.success ||
          !globalReadResult?.data?.globalUserFound
        ) {
          if (isVkRegisterMode) {
            if (isAuthDevOnlyModeEnabled()) {
              throwVkAuthError('VK_DEV_ONLY_MODE')
            }

            const registrationGuard = await assertCityOperationAllowed(
              location,
              'registration'
            )
            if (!registrationGuard.success) {
              throwVkAuthError('VK_REGISTRATION_BLOCKED')
            }
            if (!isAdultConfirmed || !personalDataAgreementAccepted) {
              console.log(
                'VK auth: required agreements are not accepted for registration'
              )
              throwVkAuthError('VK_AGREEMENTS_REQUIRED')
            }

            const resolvedReferrerId = await resolveReferrerId(db, referrerId)

            const localExistingByPhone = await usersModel
              .findOne({
                phone: { $in: phoneCandidates },
              })
              .sort({ createdAt: 1 })
              .lean()
            if (localExistingByPhone?._id) {
              if (isUserAuthBlocked(localExistingByPhone)) {
                throwVkAuthError('VK_AUTH_BLOCKED')
              }
              const vkSetForExistingUser = buildVkSetForExistingUser({
                existingUser: localExistingByPhone,
                vkProfilePatch,
              })
              const updatedByPhone = await usersModel.findByIdAndUpdate(
                localExistingByPhone._id,
                {
                  $set: {
                    ...vkSetForExistingUser,
                    registrationType:
                      localExistingByPhone.registrationType || 'vk',
                    ...(localExistingByPhone.phone || !phoneValueToSet
                      ? {}
                      : { phone: phoneValueToSet }),
                  },
                  $addToSet: {
                    authProviders: 'vk',
                  },
                },
                { returnDocument: 'after', lean: true }
              )

              await syncGlobalLinkSafe({
                location,
                user: updatedByPhone || localExistingByPhone,
                source: 'vk-auth-register-link-existing-phone',
              })

              return buildSessionPayload(
                updatedByPhone || localExistingByPhone,
                location
              )
            }

            const newUser = await usersModel.create({
              ...vkProfilePatch,
              registrationType: 'vk',
              authProviders: ['vk'],
              referrerId: resolvedReferrerId,
              phone: phoneValueToSet,
              ...(attribution ? { attribution } : {}),
            })

            await syncGlobalLinkSafe({
              location,
              user: newUser,
              source: 'vk-auth-register',
            })

            await db.model('Histories').create({
              schema: 'users',
              action: 'add',
              data: newUser,
              userId: newUser._id,
            })

            try {
              await createReferralRegistrationCoupon({ db, user: newUser })
            } catch (couponError) {
              console.log(
                'createReferralRegistrationCoupon error :>> ',
                couponError
              )
            }

            return buildSessionPayload(newUser, location)
          }

          console.log('VK auth: global account is required for login', {
            mode: mode || 'login',
            hasGlobalUser: Boolean(globalReadResult?.data?.globalUserFound),
          })
          throwVkAuthError('VK_ACCOUNT_NOT_FOUND')
        }
        throwVkAuthError('VK_ACCOUNT_NOT_FOUND')
      },
    }),
    CredentialsProvider({
      id: 'telegram',
      name: 'telegram',
      credentials: {
        telegramId: { label: 'TelegramId', type: 'number', placeholder: '' },
        first_name: { label: 'first_name', type: 'text', placeholder: '' },
        last_name: { label: 'last_name', type: 'text', placeholder: '' },
        photo_url: { label: 'photo_url', type: 'text', placeholder: '' },
        username: { label: 'username', type: 'text', placeholder: '' },
        phone: { label: 'phone', type: 'text', placeholder: '' },
        registration: {
          label: 'registration',
          type: 'text',
          placeholder: 'false',
        },
        location: { label: 'Location', type: 'text' },
        referrerId: { label: 'ReferrerId', type: 'text' },
        consentToMailing: {
          label: 'consentToMailing',
          type: 'text',
          placeholder: 'false',
        },
      },
      authorize: async (credentials) => {
        const {
          telegramId,
          first_name,
          last_name,
          photo_url,
          username,
          phone,
          registration,
          location,
          referrerId,
          consentToMailing: consentToMailingRaw,
        } = credentials ?? {}

        if (!telegramId) {
          return null
        }

        const telegramIdNum = parseInt(telegramId)
        if (!telegramIdNum || !location) {
          return null
        }

        const loginGuard = await assertCityOperationAllowed(location, 'login')
        if (!loginGuard.success) {
          return null
        }
        const telegramAuthGuard = await assertCityOperationAllowed(
          location,
          'telegram_auth'
        )
        if (!telegramAuthGuard.success) {
          return null
        }

        const phoneNumber = parsePhoneNumber(phone)
        const phoneDigits = normalizePhoneDigits(phoneNumber ?? phone)
        const phoneNumberNormalized = phoneDigits ? Number(phoneDigits) : null
        const consentToMailing = parseBooleanFromInput(consentToMailingRaw)
        const db = await dbConnect(location)
        if (!db) return null
        await ensureConsentToMailingField(db, location)

        const usersModel = db.model('Users')

        const globalUserByTelegramId = isGlobalUsersReadEnabled(location)
          ? await readGlobalUserByTelegramId(telegramIdNum)
          : null
        if (globalUserByTelegramId?.phone) {
          const globalReadResult = await ensureLocalUserFromGlobalByPhone({
            db,
            location,
            phone: globalUserByTelegramId.phone,
            source: 'telegram-global-id-read',
          })

          const globalLocalUser = globalReadResult?.data?.localUser
          if (
            globalReadResult?.success &&
            globalReadResult?.data?.globalUserFound &&
            globalLocalUser?._id
          ) {
            if (isUserAuthBlocked(globalLocalUser)) return null
            if (
              !isAuthDevOnlyUserAllowed(
                globalLocalUser,
                phoneNumberNormalized ?? globalUserByTelegramId.phone
              )
            ) {
              return null
            }

            const existingTelegramNotification =
              globalLocalUser.notifications?.telegram ??
              globalLocalUser.notifications?.get?.('telegram')

            const telegramUpdate = {
              'notifications.telegram.id': telegramIdNum,
              'notifications.telegram.active':
                typeof existingTelegramNotification?.active === 'boolean'
                  ? existingTelegramNotification.active
                  : false,
            }

            if (typeof username !== 'undefined') {
              telegramUpdate['notifications.telegram.userName'] = username
            }

            if (!globalLocalUser.phone && phoneNumberNormalized) {
              telegramUpdate.phone = phoneNumberNormalized
            }

            const linkedUser = await usersModel
              .findByIdAndUpdate(
                globalLocalUser._id,
                {
                  $set: telegramUpdate,
                  $addToSet: {
                    authProviders: 'telegram',
                  },
                },
                { returnDocument: 'after' }
              )
              .lean()

            if (!linkedUser?._id) return null

            await syncGlobalLinkSafe({
              location,
              user: linkedUser,
              source: 'telegram-global-id-login',
            })

            return buildSessionPayload(linkedUser, location)
          }
        }

        const fetchedUser = await usersModel
          .findOne({
            'notifications.telegram.id': telegramIdNum,
          })
          .lean()

        if (fetchedUser?._id) {
          if (isUserAuthBlocked(fetchedUser)) return null
          if (!isAuthDevOnlyUserAllowed(fetchedUser, phoneNumberNormalized)) {
            return null
          }
          if (phoneNumber && !fetchedUser.phone) {
            await usersModel.findByIdAndUpdate(fetchedUser._id, {
              $set: { phone: phoneNumber },
            })
          }
          await syncGlobalLinkSafe({
            location,
            user: fetchedUser,
            source: 'telegram-login',
          })
          return buildSessionPayload(fetchedUser, location)
        }

        if (phoneDigits) {
          const userByPhone = await usersModel
            .findOne({
              phone: {
                $in: [phoneNumberNormalized, phoneDigits],
              },
            })
            .lean()

          if (userByPhone?._id) {
            if (isUserAuthBlocked(userByPhone)) return null
            if (!isAuthDevOnlyUserAllowed(userByPhone, phoneNumberNormalized)) {
              return null
            }
            const existingTelegramNotification =
              userByPhone.notifications?.telegram ??
              userByPhone.notifications?.get?.('telegram')

            const telegramUpdate = {
              'notifications.telegram.id': telegramIdNum,
              'notifications.telegram.active':
                typeof existingTelegramNotification?.active === 'boolean'
                  ? existingTelegramNotification.active
                  : false,
            }

            if (typeof username !== 'undefined') {
              telegramUpdate['notifications.telegram.userName'] = username
            }

            if (!userByPhone.phone && phoneNumberNormalized) {
              telegramUpdate.phone = phoneNumberNormalized
            }

            await usersModel.findByIdAndUpdate(userByPhone._id, {
              $set: telegramUpdate,
              $addToSet: {
                authProviders: 'telegram',
              },
            })
            await syncGlobalLinkSafe({
              location,
              user: userByPhone,
              source: 'telegram-phone-link',
            })

            return buildSessionPayload(userByPhone, location)
          }
        }

        if (registration === 'true') {
          if (isAuthDevOnlyModeEnabled()) {
            return null
          }
          const registrationGuard = await assertCityOperationAllowed(
            location,
            'registration'
          )
          if (!registrationGuard.success) {
            return null
          }

          const resolvedReferrerId = await resolveReferrerId(db, referrerId)
          const newUser = await usersModel.create({
            notifications: {
              telegram: {
                id: telegramIdNum,
                active: false,
                userName: username,
              },
            },
            firstName: first_name,
            secondName: last_name === 'undefined' ? undefined : last_name,
            images: [photo_url],
            registrationType: 'telegram',
            authProviders: ['telegram'],
            ...(phoneNumberNormalized ? { phone: phoneNumberNormalized } : {}),
            referrerId: resolvedReferrerId,
            consentToMailing,
          })
          await db.model('Histories').create({
            schema: 'users',
            action: 'add',
            data: newUser,
            userId: newUser._id,
          })
          try {
            await createReferralRegistrationCoupon({ db, user: newUser })
          } catch (couponError) {
            console.log('createReferralRegistrationCoupon error :>> ', couponError)
          }
          await syncGlobalLinkSafe({
            location,
            user: newUser,
            source: 'telegram-register',
          })
          await userRegisterTelegramNotification({
            telegramId: telegramIdNum,
            first_name,
            last_name: last_name === 'undefined' ? undefined : last_name,
            images: [photo_url],
            location,
            referrerId: resolvedReferrerId ? resolvedReferrerId.toString() : undefined,
          })
          return buildSessionPayload(newUser, location)
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
        token.location = user.email
        token.userId = user.name
      }

      if (trigger === 'update' && session?.location) {
        const nextLocation = String(session.location).trim()
        if (checkLocationValid(nextLocation)) {
          const loginGuard = await assertCityOperationAllowed(nextLocation, 'login')
          if (loginGuard?.success) {
            token.location = nextLocation
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      const userId = String(token?.userId || session?.user?.name || '').trim()
      const location = String(token?.location || session?.user?.email || '').trim()
      const phone = token?.phone ?? session?.user?.phone

      const db = await dbConnect(location)
      if (!db) return null
      await ensureConsentToMailingField(db, location)

      let result =
        userId && mongoose.Types.ObjectId.isValid(userId)
          ? await db.model('Users').findById(userId)
          : null

      if (!result && phone) {
        const globalReadResult = await ensureLocalUserFromGlobalByPhone({
          db,
          location,
          phone,
          source: 'session-location-switch',
        })
        if (!globalReadResult?.success) return null
        const resolvedUserId = globalReadResult.data?.localUser?._id
        if (resolvedUserId) {
          result = await db.model('Users').findById(resolvedUserId)
        }
      }

      if (!result) return null
      if (isUserAuthBlocked(result)) return null
      token.userId = String(result._id)
      token.phone = result.phone

      session.user.authDevOnlyMode = isAuthDevOnlyModeEnabled()
      const globalUser = isGlobalUsersReadEnabled(location)
        ? (result?.phone ? await readGlobalUserByPhone(result.phone) : null) ||
          (result?.globalUserId
            ? await readGlobalUserById(result.globalUserId)
            : null)
        : null
      const globalProfile = toPlainObject(globalUser?.profile) || {}
      const globalSecurity = toPlainObject(globalProfile?.security) || {}
      const globalNotifications = toPlainObject(globalUser?.notifications)

      if (result) {
        result.prevActivityAt = result.lastActivityAt
        result.lastActivityAt = Date.now()
        result.save()

        session.user._id = result._id
        session.user.role = result.role
        session.user.firstName = resolveGlobalFirst(
          globalProfile?.firstName,
          result.firstName
        )
        session.user.secondName = resolveGlobalFirst(
          globalProfile?.secondName,
          result.secondName
        )
        session.user.thirdName = resolveGlobalFirst(
          globalProfile?.thirdName,
          result.thirdName
        )
        session.user.phone = result.phone
        session.user.globalUserId = resolveGlobalFirst(
          globalUser?._id ? String(globalUser._id) : null,
          result.globalUserId
        )
        session.user.email = resolveGlobalFirst(globalProfile?.email, result.email)
        session.user.whatsapp = resolveGlobalFirst(
          globalProfile?.whatsapp,
          result.whatsapp
        )
        session.user.ok = resolveGlobalFirst(globalProfile?.ok, result.ok)
        session.user.telegram = resolveGlobalFirst(
          globalProfile?.telegram,
          result.telegram
        )
        session.user.instagram = resolveGlobalFirst(
          globalProfile?.instagram,
          result.instagram
        )
        session.user.vk = resolveGlobalFirst(globalProfile?.vk, result.vk)
        session.user.gender = resolveGlobalFirst(globalProfile?.gender, result.gender)
        session.user.relationship = resolveGlobalFirst(
          globalProfile?.relationship,
          result.relationship
        )
        session.user.town = resolveGlobalFirst(globalUser?.town, result.town)
        session.user.personalStatus = resolveGlobalFirst(
          globalUser?.personalStatus,
          result.personalStatus
        )
        session.user.birthday = resolveGlobalFirst(
          globalProfile?.birthday,
          result.birthday
        )
        session.user.lastActivityAt = resolveGlobalFirst(
          globalUser?.lastActivityAt,
          result.lastActivityAt
        )
        session.user.prevActivityAt = result.prevActivityAt
        session.user.orientation = result.orientation
        session.user.status = result.status
        session.user.images = resolveGlobalFirst(globalProfile?.images, result.images)
        session.user.haveKids = resolveGlobalFirst(
          globalProfile?.haveKids,
          result.haveKids
        )
        session.user.security =
          Object.keys(globalSecurity).length > 0 ? globalSecurity : result.security
        const localNotifications = toPlainObject(result.notifications)
        const localNotificationSettings =
          normalizeNotificationSettings(localNotifications)
        session.user.notifications = {
          ...localNotifications,
          // Настройки уведомлений хранятся по локациям (локально),
          // а не в глобальном профиле пользователя.
          settings: localNotificationSettings,
        }
        session.user.eventAchievements = result.eventAchievements
        session.user.registrationType = resolveGlobalFirst(
          globalUser?.registrationType,
          result.registrationType
        )
        session.user.authProviders = result.authProviders
        session.user.cities = Array.isArray(globalUser?.cities)
          ? globalUser.cities.filter((city) => checkLocationValid(city))
          : []
        session.user.referrerId = resolveGlobalFirst(
          globalUser?.referrerId,
          result.referrerId
        )
        const localConsentToMailing = result.consentToMailing
        const globalConsentToMailing = globalUser?.notifications?.consentToMailing
        session.user.consentToMailing =
          typeof localConsentToMailing === 'boolean'
            ? localConsentToMailing
            : resolveGlobalFirst(globalConsentToMailing, localConsentToMailing)
        session.user.archive = resolveGlobalFirst(globalUser?.archive, result.archive)
        session.user.createdAt = result.createdAt
        session.user.updatedAt = result.updatedAt
      }

      session.location = location
      return session
    },
  },
  jwt: {
    secret: AUTH_JWT_SECRET,
    encryption: true,
  },
  pages: {
    signIn: '/login',
  },
}

