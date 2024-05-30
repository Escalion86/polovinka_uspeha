import { DEFAULT_ROLES } from '@helpers/constants'
import getUserFullName from '@helpers/getUserFullName'
import Roles from '@models/Roles'
import Services from '@models/Services'
import Users from '@models/Users'
import sendTelegramMessage from '@server/sendTelegramMessage'
import dbConnect from '@utils/dbConnect'

// Оповещение в телеграм
const serviceUserTelegramNotification = async ({ req, serviceId, userId }) => {
  if (serviceId && userId) {
    await dbConnect()
    const rolesSettings = await Roles.find({})
    const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
    const rolesIdsToServiceUsersNotification = allRoles
      .filter((role) => role?.notifications?.serviceRegistration)
      .map((role) => role._id)

    // Получаем список подписанных на уведомления, и если их нет, то выходим сразу
    const usersWithTelegramNotificationsOfServiceUsersON = await Users.find({
      role:
        process.env.NODE_ENV === 'development'
          ? 'dev'
          : { $in: rolesIdsToServiceUsersNotification },
      'notifications.settings.serviceRegistration': true,
      'notifications.telegram.active': true,
      'notifications.telegram.id': {
        $exists: true,
        $ne: null,
      },
    }).lean()

    if (
      !usersWithTelegramNotificationsOfServiceUsersON ||
      usersWithTelegramNotificationsOfServiceUsersON?.length === 0
    )
      return

    const service = await Services.findById(serviceId).lean()
    const user = await Users.findById(userId).lean()

    const text = `\u{1F91D}\u{2795}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
      user
    )} ${user.status === 'member' ? '(клуб) ' : ''}<b>подал${
      user.gender === 'male' ? '' : 'а'
    } заявку</b> на услугу "${service.title}".`

    const usersTelegramIds = usersWithTelegramNotificationsOfServiceUsersON.map(
      (user) => user.notifications?.telegram?.id
    )

    const result = await sendTelegramMessage({
      req,
      telegramIds: usersTelegramIds,
      text,
      inline_keyboard: [
        [
          {
            text: '\u{1F4C5} Услуга',
            url: process.env.DOMAIN + '/service/' + serviceId,
          },
          {
            text: '\u{1F464} Пользователь',
            url: process.env.DOMAIN + '/user/' + userId,
          },
        ],
      ],
    })

    return result
  }
}

export default serviceUserTelegramNotification
