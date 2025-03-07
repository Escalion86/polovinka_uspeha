import { DEFAULT_ROLES } from '@helpers/constants'
import getUserFullName from '@helpers/getUserFullName'

import sendTelegramMessage from '@server/sendTelegramMessage'
import dbConnect from '@utils/dbConnect'

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
    const usersWithTelegramNotificationsOfServiceUsersON = await db
      .model('Users')
      .find({
        role:
          process.env.TELEGRAM_NOTIFICATION_DEV_ONLY === 'true'
            ? 'dev'
            : { $in: rolesIdsToServiceUsersNotification },
        'notifications.settings.serviceRegistration': true,
        'notifications.telegram.active': true,
        'notifications.telegram.id': {
          $exists: true,
          $ne: null,
        },
      })
      .lean()

    if (
      !usersWithTelegramNotificationsOfServiceUsersON ||
      usersWithTelegramNotificationsOfServiceUsersON?.length === 0
    )
      return

    const service = await db.model('Services').findById(serviceId).lean()
    const user = await db.model('Users').findById(userId).lean()

    const text = `\u{1F91D}\u{2795}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
      user
    )} ${user.status === 'member' ? '(клуб) ' : ''}<b>подал${
      user.gender === 'male' ? '' : 'а'
    } заявку</b> на услугу "${service.title}".`

    const usersTelegramIds = usersWithTelegramNotificationsOfServiceUsersON.map(
      (user) => user.notifications?.telegram?.id
    )

    const result = await sendTelegramMessage({
      telegramIds: usersTelegramIds,
      text,
      inline_keyboard: [
        [
          {
            text: '\u{1F4C5} Услуга',
            url: process.env.DOMAIN + '/' + location + '/service/' + serviceId,
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
