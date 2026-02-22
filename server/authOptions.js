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
import { normalizePhoneValue } from '@helpers/phoneUtils'
import { exchangeVkCode, fetchVkUserInfo } from './vkIdAuth'
import syncGlobalUserLink from './syncGlobalUserLink'
import ensureLocalUserFromGlobalByPhone from './ensureLocalUserFromGlobalByPhone'
import resolvePasswordFromGlobalByPhone from './resolvePasswordFromGlobalByPhone'

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
  return normalized || null
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

          await ensureLocalUserFromGlobalByPhone({
            db,
            location,
            phone,
            source: 'login-read',
          })

          let fetchedUser = await db
            .model('Users')
            .findOne({ phone })
            .lean()

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

          return {
            name: fetchedUser._id,
            email: location,
          }
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
        location: { label: 'Location', type: 'text' },
        mode: { label: 'Mode', type: 'text' },
        state: { label: 'State', type: 'text' },
        codeVerifier: { label: 'CodeVerifier', type: 'text' },
        referrerId: { label: 'ReferrerId', type: 'text' },
        consentToMailing: { label: 'consentToMailing', type: 'text' },
        attribution: { label: 'Attribution', type: 'text' },
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
          location,
          mode,
          state,
          codeVerifier,
          referrerId,
          consentToMailing: consentToMailingRaw,
          attribution: attributionRaw,
          isAdultConfirmed: isAdultConfirmedRaw,
          personalDataAgreementAccepted: personalDataAgreementAcceptedRaw,
        } = credentials ?? {}

        if (!code || !deviceId || !location) return null

        const loginGuard = await assertCityOperationAllowed(location, 'login')
        if (!loginGuard.success) return null
        const vkAuthGuard = await assertCityOperationAllowed(location, 'vk_auth')
        if (!vkAuthGuard.success) return null

        const exchangeResult = await exchangeVkCode({
          code,
          deviceId,
          codeVerifier,
          state,
        })
        if (!exchangeResult.success) {
          console.log('VK exchange error:', exchangeResult?.data)
          return null
        }

        const accessToken = exchangeResult?.data?.access_token
        if (!accessToken) return null

        const userInfoResult = await fetchVkUserInfo({ accessToken })
        if (!userInfoResult.success) {
          console.log('VK userInfo error:', userInfoResult?.data)
          return null
        }

        const vkUser = userInfoResult?.data?.user || {}
        const vkId =
          normalizeVkId(vkUser?.user_id) ||
          normalizeVkId(exchangeResult?.data?.user_id)
        if (!vkId) return null

        const db = await dbConnect(location)
        if (!db) return null
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
        const vkProfilePatch = buildVkProfilePatch({
          vkUser,
          vkId,
          consentToMailing,
        })
        const phoneCandidates = getPhoneCandidates(vkUser?.phone)
        const phoneValueToSet =
          phoneCandidates.length > 0 && Number.isFinite(Number(phoneCandidates[0]))
            ? Number(phoneCandidates[0])
            : null

        const userByVkId = await usersModel.findOne({ vk: vkId }).lean()
        if (userByVkId?._id) {
          const updatedUser = await usersModel.findByIdAndUpdate(
            userByVkId._id,
            {
              $set: {
                ...vkProfilePatch,
                registrationType: userByVkId.registrationType || 'vk',
                ...(userByVkId.phone || !phoneValueToSet
                  ? {}
                  : { phone: phoneValueToSet }),
              },
              $addToSet: {
                authProviders: 'vk',
              },
            },
            { new: true, lean: true }
          )
          await syncGlobalLinkSafe({
            location,
            user: updatedUser || userByVkId,
            source: 'vk-auth-login',
          })
          return {
            name: userByVkId._id,
            email: location,
          }
        }

        if (phoneCandidates.length === 0) {
          console.log('VK auth: phone is required for auto-link/register')
          return null
        }

        if (phoneCandidates.length > 0) {
          const userByPhone = await usersModel
            .findOne({
              phone: { $in: phoneCandidates },
            })
            .lean()

          if (userByPhone?._id) {
            const updatedUser = await usersModel.findByIdAndUpdate(
              userByPhone._id,
              {
                $set: {
                  ...vkProfilePatch,
                  registrationType: userByPhone.registrationType || 'vk',
                  ...(userByPhone.phone ? {} : { phone: phoneValueToSet }),
                },
                $addToSet: {
                  authProviders: 'vk',
                },
              },
              { new: true, lean: true }
            )
            await syncGlobalLinkSafe({
              location,
              user: updatedUser || userByPhone,
              source: 'vk-auth-phone-link',
            })
            return {
              name: userByPhone._id,
              email: location,
            }
          }
        }

        if (mode === 'login') return null

        const registrationGuard = await assertCityOperationAllowed(
          location,
          'registration'
        )
        if (!registrationGuard.success) return null
        if (!isAdultConfirmed || !personalDataAgreementAccepted) {
          console.log(
            'VK auth: required agreements are not accepted for registration'
          )
          return null
        }

        const resolvedReferrerId = await resolveReferrerId(db, referrerId)
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
          console.log('createReferralRegistrationCoupon error :>> ', couponError)
        }

        return {
          name: newUser._id,
          email: location,
        }
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

        const phoneNumber = parsePhoneNumber(phone)
        const phoneDigits = normalizePhoneDigits(phoneNumber ?? phone)
        const phoneNumberNormalized = phoneDigits ? Number(phoneDigits) : null
        const consentToMailing = parseBooleanFromInput(consentToMailingRaw)
        const db = await dbConnect(location)
        if (!db) return null
        await ensureConsentToMailingField(db, location)

        const usersModel = db.model('Users')

        const fetchedUser = await usersModel
          .findOne({
            'notifications.telegram.id': telegramIdNum,
          })
          .lean()

        if (fetchedUser?._id) {
          if (phoneNumber && !fetchedUser.phone) {
            await usersModel.findByIdAndUpdate(fetchedUser._id, {
              $set: { phone: phoneNumber },
            })
          }
          return {
            name: fetchedUser._id,
            email: location,
          }
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

            return {
              name: userByPhone._id,
              email: location,
            }
          }
        }

        if (registration === 'true') {
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
          await userRegisterTelegramNotification({
            telegramId: telegramIdNum,
            first_name,
            last_name: last_name === 'undefined' ? undefined : last_name,
            images: [photo_url],
            location,
            referrerId: resolvedReferrerId ? resolvedReferrerId.toString() : undefined,
          })
          return {
            name: newUser._id,
            email: location,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const userId = session.user.name
      const location = session.user.email

      const db = await dbConnect(location)
      if (!db) return null
      await ensureConsentToMailingField(db, location)

      const result = await db.model('Users').findById(userId)

      if (result) {
        result.prevActivityAt = result.lastActivityAt
        result.lastActivityAt = Date.now()
        result.save()

        session.user._id = result._id
        session.user.role = result.role
        session.user.firstName = result.firstName
        session.user.secondName = result.secondName
        session.user.thirdName = result.thirdName
        session.user.phone = result.phone
        session.user.email = result.email
        session.user.whatsapp = result.whatsapp
        session.user.ok = result.ok
        session.user.telegram = result.telegram
        session.user.instagram = result.instagram
        session.user.vk = result.vk
        session.user.gender = result.gender
        session.user.relationship = result.relationship
        session.user.town = result.town
        session.user.personalStatus = result.personalStatus
        session.user.birthday = result.birthday
        session.user.lastActivityAt = result.lastActivityAt
        session.user.prevActivityAt = result.prevActivityAt
        session.user.orientation = result.orientation
        session.user.status = result.status
        session.user.images = result.images
        session.user.haveKids = result.haveKids
        session.user.security = result.security
        session.user.notifications = result.notifications
        session.user.eventAchievements = result.eventAchievements
        session.user.eventsTagsNotification = result.eventsTagsNotification
        session.user.registrationType = result.registrationType
        session.user.authProviders = result.authProviders
        session.user.referrerId = result.referrerId
        session.user.consentToMailing = result.consentToMailing
        session.user.createdAt = result.createdAt
        session.user.updatedAt = result.updatedAt
      }

      session.location = location
      return session
    },
  },
  jwt: {
    secret: 'test',
    encryption: true,
  },
  pages: {
    signIn: '/login',
  },
}

export default authOptions
