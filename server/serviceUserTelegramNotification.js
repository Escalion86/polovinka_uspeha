import { DEFAULT_ROLES } from '@helpers/constants'
import getUserFullName from '@helpers/getUserFullName'

import sendTelegramMessage from '@server/sendTelegramMessage'
import sendPushNotification from '@server/sendPushNotification'
import getUsersPushSubscriptions from '@server/getUsersPushSubscriptions'
import dbConnect from '@utils/dbConnect'
import { createInvalidPushSubscriptionCollector } from './pushSubscriptionsCleanup'

// Оповещение в телеграм
const serviceUserTelegramNotification = async ({
  req,
  serviceId,
  userId,
  location,
}) => {
  if (serviceId && userId) {
    const db = await dbConnect(location)
    if (!db) return

    const rolesSettings = await db.model('Roles').find({})
    const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
    const rolesIdsToServiceUsersNotification = allRoles
      .filter((role) => role?.notifications?.serviceRegistration)
      .map((role) => role._id)

    // Получаем список подписанных на уведомления, и если их нет, то выходим сразу
    const usersWithNotificationsOfServiceUsersON = await db
      .model('Users')
      .find({
        role:
          process.env.TELEGRAM_NOTIFICATION_DEV_ONLY === 'true'
            ? 'dev'
            : { $in: rolesIdsToServiceUsersNotification },
        'notifications.settings.serviceRegistration': true,
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

    if (
      !usersWithNotificationsOfServiceUsersON ||
      usersWithNotificationsOfServiceUsersON?.length === 0
    )
      return

    const service = await db.model('Services').findById(serviceId).lean()
    const user = await db.model('Users').findById(userId).lean()

    const text = `\u{1F91D}\u{2795}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
      user
    )} ${user.status === 'member' ? '(клуб) ' : ''}<b>подал${
      user.gender === 'male' ? '' : 'а'
    } заявку</b> на услугу "${service.title}".`

    const usersTelegramIds = usersWithNotificationsOfServiceUsersON
      .filter((user) => user.notifications?.telegram?.active)
      .map((user) => user.notifications?.telegram?.id)

    const pushSubscriptions = getUsersPushSubscriptions(
      usersWithNotificationsOfServiceUsersON
    )

    const serviceUrl = process.env.DOMAIN
      ? `${process.env.DOMAIN}/${location}/service/${serviceId}`
      : `/${location}/service/${serviceId}`

    if (pushSubscriptions.length > 0) {
      const pushCleanup = createInvalidPushSubscriptionCollector({
        db,
        logPrefix: '[serviceUserTelegramNotification] Service request push',
      })

      try {
        await sendPushNotification({
          subscriptions: pushSubscriptions,
          payload: {
            title: 'Новая заявка на услугу',
            body: text,
            data: {
              url: serviceUrl,
              userId: String(userId),
            },
            tag: `service-request-${serviceId}`,
          },
          onSubscriptionRejected: pushCleanup.handleRejected,
        })
      } finally {
        await pushCleanup.flush()
      }
    }

    const filteredTelegramIds = usersTelegramIds.filter(Boolean)

    if (filteredTelegramIds.length === 0) return

    const result = await sendTelegramMessage({
      telegramIds: filteredTelegramIds,
      text,
      inline_keyboard: [
        [
          {
            text: '\u{1F4C5} Услуга',
            url: serviceUrl,
          },
          {
            text: '\u{1F464} Пользователь',
            url: process.env.DOMAIN + '/' + location + '/user/' + userId,
          },
        ],
      ],
      location,
    })

    return result
  }
}

export default serviceUserTelegramNotification
