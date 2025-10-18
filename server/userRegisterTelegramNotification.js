import telegramPost from './telegramApi'
import { DEFAULT_ROLES } from '@helpers/constants'
import mongoose from 'mongoose'
import dbConnect from '@utils/dbConnect'
import getTelegramTokenByLocation from './getTelegramTokenByLocation'
import sendPushNotification from './sendPushNotification'
import getUsersPushSubscriptions from './getUsersPushSubscriptions'

const buildFullName = (user) => {
  if (!user) return null

  const parts = [user?.secondName, user?.firstName, user?.thirdName]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean)

  return parts.length ? parts.join(' ') : null
}

const userRegisterTelegramNotification = async ({
  phone,
  telegramId,
  first_name,
  last_name,
  images,
  location,
  referrerId,
}) => {
  const db = await dbConnect(location)
  if (!db) return

  const telegramToken = getTelegramTokenByLocation(location)
  if (!telegramToken) return

  const usersCount = await db.model('Users').countDocuments({})

  let referrerFullName = null
  if (referrerId && mongoose.Types.ObjectId.isValid(referrerId)) {
    const referrer = await db
      .model('Users')
      .findById(referrerId)
      .select({ firstName: 1, secondName: 1, thirdName: 1 })
      .lean()

    referrerFullName = buildFullName(referrer)
  }

  const rolesSettings = await db.model('Roles').find({})
  const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
  const rolesIdsToEventUsersNotification = allRoles
    .filter((role) => role?.notifications?.newUserRegistred)
    .map((role) => role._id)

  const usersWithNotificationsOfEventUsersON = await db
    .model('Users')
    .find({
      role:
        process.env.TELEGRAM_NOTIFICATION_DEV_ONLY === 'true'
          ? 'dev'
          : { $in: rolesIdsToEventUsersNotification },
      'notifications.settings.newUserRegistred': true,
      $or: [
        {
          'notifications.telegram.active': true,
          'notifications.telegram.id': {
            $exists: true,
            $ne: null,
          },
        },
        {
          'notifications.push.active': true,
          'notifications.push.subscriptions.0': { $exists: true },
        },
      ],
    })
    .lean()

  const usersTelegramIds = usersWithNotificationsOfEventUsersON
    .filter((user) => user.notifications?.telegram?.active)
    .map((user) => user.notifications?.telegram?.id)

  const pushSubscriptions = getUsersPushSubscriptions(
    usersWithNotificationsOfEventUsersON
  )

  const messageParts = [`Зарегистрирован новый пользователь №${usersCount}`]
  if (phone) {
    messageParts.push(`с телефонным номером +${phone}`)
  }
  if (telegramId) {
    const namePart = first_name
      ? ` с именем ${first_name}${last_name ? ` ${last_name}` : ''}`
      : ''
    messageParts.push(`через Телеграм${namePart}`)
  }

  const referrerPart = referrerFullName
    ? `\nРеферер: ${referrerFullName}`
    : ''

  const text = `${messageParts.join(' ')}${referrerPart}`

  if (pushSubscriptions.length > 0) {
    await sendPushNotification({
      subscriptions: pushSubscriptions,
      payload: {
        title: 'Новый пользователь зарегистрирован',
        body: text,
        data: {
          url: process.env.DOMAIN
            ? `${process.env.DOMAIN}/${location}/users`
            : `/${location}/users`,
        },
        tag: `user-register-${usersCount}`,
      },
    })
  }

  return await Promise.all(
    usersTelegramIds
      .filter(Boolean)
      .map(async (chat_id) =>
        telegramPost(
          `https://api.telegram.org/bot${telegramToken}/sendMessage`,
          {
            chat_id,
            text,
            parse_mode: 'html',
          },
          (data) => console.log('data', data),
          (data) => console.log('error', data),
          true
        )
      )
  )
}

export default userRegisterTelegramNotification
