import { DEFAULT_ROLES } from '@helpers/constantsServer'
import getUserFullName from '@helpers/getUserFullName'
import {
  notifyUsersWithPush,
  supportsPushForUser,
} from './pushNotifications'

const relationshipTitle = (value) => {
  if (value === true || value === 'havePartner') return 'В паре'
  if (value === 'married') return 'В браке'
  if (value === false || value === 'noPartner') return 'Не в паре'
  return 'Не указано'
}

const haveKidsTitle = (value) => {
  if (value === true) return 'Да'
  if (value === false) return 'Нет'
  return 'Не указано'
}

const buildChanges = (oldUser, newUser) => {
  const changes = []

  if (oldUser?.relationship !== newUser?.relationship) {
    changes.push(
      `Статус отношений: ${relationshipTitle(oldUser?.relationship)} → ${relationshipTitle(newUser?.relationship)}`
    )
  }

  if (oldUser?.haveKids !== newUser?.haveKids) {
    changes.push(
      `Есть дети: ${haveKidsTitle(oldUser?.haveKids)} → ${haveKidsTitle(newUser?.haveKids)}`
    )
  }

  return changes
}

export const hasUserRelationshipDataChanges = (oldUser, newUser) =>
  buildChanges(oldUser, newUser).length > 0

const userRelationshipDataChangedPushNotification = async ({
  db,
  location,
  oldUser,
  newUser,
}) => {
  const changes = buildChanges(oldUser, newUser)
  if (!db || !newUser?._id || changes.length === 0) return

  const rolesSettings = await db.model('Roles').find({}).lean()
  const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
  const roleIds = allRoles
    .filter((role) => role?.notifications?.userRelationshipDataChanged)
    .map((role) => role._id)

  if (roleIds.length === 0) return

  const recipients = await db
    .model('Users')
    .find({
      role:
        process.env.TELEGRAM_NOTIFICATION_DEV_ONLY === 'true'
          ? 'dev'
          : { $in: roleIds },
      'notifications.settings.userRelationshipDataChanged': true,
      'notifications.push.active': true,
      'notifications.push.subscriptions.0': { $exists: true },
    })
    .lean()

  const usersWithPush = recipients.filter((user) => supportsPushForUser(user))
  if (usersWithPush.length === 0) return

  const userName = getUserFullName(newUser) || `Пользователь +${newUser.phone}`
  const text = `${userName} изменил(а) данные анкеты:\n${changes.join('\n')}`
  const userId = String(newUser._id)

  return await notifyUsersWithPush({
    db,
    location,
    users: usersWithPush,
    title: 'Изменение данных об отношениях',
    text,
    url: process.env.DOMAIN
      ? `${process.env.DOMAIN}/${location}/user/${userId}`
      : `/${location}/user/${userId}`,
    tag: `user-relationship-data-changed-${userId}`,
    notificationType: 'userRelationshipDataChanged',
    entities: { userId },
  })
}

export default userRelationshipDataChangedPushNotification
