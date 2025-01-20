import { postData } from '@helpers/CRUD'
import { DEFAULT_ROLES } from '@helpers/constants'
import Roles from '@models/Roles'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import getTelegramTokenByLocation from './getTelegramTokenByLocation'

const userRegisterTelegramNotification = async ({
  phone,
  telegramId,
  first_name,
  last_name,
  images,
  location,
}) => {
  const db = await dbConnect(location)
  if (!db) return

  const telegramToken = getTelegramTokenByLocation(location)
  if (!telegramToken) return

  const usersCount = await Users.countDocuments({})

  const rolesSettings = await Roles.find({})
  const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
  const rolesIdsToEventUsersNotification = allRoles
    .filter((role) => role?.notifications?.newUserRegistred)
    .map((role) => role._id)

  const usersWithTelegramNotificationsOfEventUsersON = await Users.find({
    role:
      process.env.TELEGRAM_NOTIFICATION_DEV_ONLY === 'true'
        ? 'dev'
        : { $in: rolesIdsToEventUsersNotification },
    'notifications.settings.newUserRegistred': true,
    'notifications.telegram.active': true,
    'notifications.telegram.id': {
      $exists: true,
      $ne: null,
    },
  })
  const usersTelegramIds = usersWithTelegramNotificationsOfEventUsersON.map(
    (user) => user.notifications?.get('telegram')?.id
  )

  return await Promise.all(
    usersTelegramIds.map(async (chat_id) => {
      await postData(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          chat_id,
          text: `Зарегистрирован новый пользователь №${usersCount} ${phone ? `с телефонным номером +${phone}` : ''}${telegramId ? `через Телеграм${first_name ? ` с именем ${first_name}${last_name ? ` ${last_name}` : ''}` : ''}` : ''}`,
          parse_mode: 'html',
        },
        (data) => console.log('data', data),
        (data) => console.log('error', data),
        true,
        null,
        true
      )
    })
  )
}

export default userRegisterTelegramNotification
