import { DEFAULT_ROLES } from '@helpers/constantsServer'
import getUserFullName from '@helpers/getUserFullName'

import sendTelegramMessage from '@server/sendTelegramMessage'
import dbConnect from '@utils/dbConnect'
import {
  notifyUsersWithPush,
  pushTextFromHtml,
  supportsPushForUser,
} from './pushNotifications'

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
            'notifications.push.subscriptions.0': {
              $exists: true,
            },
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
    )} ${user.status === 'member' ? '(ЗП) ' : ''}<b>подал${
      user.gender === 'male' ? '' : 'а'
    } заявку</b> на услугу "${service.title}".`

    const usersTelegramIds = usersWithNotificationsOfServiceUsersON
      .filter((user) => user.notifications?.telegram?.active)
      .map((user) => user.notifications?.telegram?.id)

    const serviceUrl = process.env.DOMAIN
      ? `${process.env.DOMAIN}/${location}/service/${serviceId}`
      : `/${location}/service/${serviceId}`

    const filteredTelegramIds = usersTelegramIds.filter(Boolean)

    let result
    if (filteredTelegramIds.length > 0) {
      result = await sendTelegramMessage({
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
    }

    const usersWithPush = usersWithNotificationsOfServiceUsersON.filter((user) =>
      supportsPushForUser(user)
    )
    if (usersWithPush.length > 0) {
      await notifyUsersWithPush({
        db,
        location,
        users: usersWithPush,
        title: 'Новая заявка на услугу',
        text: pushTextFromHtml(text),
        url: serviceUrl,
        tag: `service-registration-${serviceId}`,
        notificationType: 'serviceRegistration',
      })
    }

    return result
  }
}

export default serviceUserTelegramNotification
