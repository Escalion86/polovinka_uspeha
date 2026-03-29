import formatDateTime from '@helpers/formatDateTime'
import sendTelegramMessage from './sendTelegramMessage'
import {
  notifyUsersWithPush,
  pushTextFromHtml,
  supportsPushForUser,
} from './pushNotifications'

const toObjectIdString = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value)
  }
  if (typeof value === 'object') {
    if (typeof value._id === 'string') return value._id
    if (typeof value.toString === 'function') {
      const asString = value.toString()
      if (asString && asString !== '[object Object]') return asString
    }
  }
  return ''
}

const getFromObjectOrMap = (source, key) => {
  if (!source || typeof source !== 'object') return undefined
  if (Object.prototype.hasOwnProperty.call(source, key)) return source[key]
  if (typeof source.get === 'function') return source.get(key)
  return undefined
}

const getUserSettings = (user) => {
  const notifications = user?.notifications
  const settings = getFromObjectOrMap(notifications, 'settings')
  return settings && typeof settings === 'object' ? settings : {}
}

const getUserTelegram = (user) => {
  const notifications = user?.notifications
  const telegram = getFromObjectOrMap(notifications, 'telegram')
  return telegram && typeof telegram === 'object' ? telegram : {}
}

const getEventSubEventLabel = (event, subEventId) => {
  if (!subEventId || !Array.isArray(event?.subEvents) || event.subEvents.length < 2) {
    return ''
  }
  const subEvent = event.subEvents.find((item) => item?.id === subEventId)
  return subEvent?.title ? `\nВариант участия: ${subEvent.title}` : ''
}

const getEventUrl = (location, eventId) =>
  process.env.DOMAIN
    ? `${process.env.DOMAIN}/${location}/event/${eventId}`
    : `/${location}/event/${eventId}`

const getUsersForOwnEventNotifications = async ({
  db,
  userIds = [],
  settingKey,
}) => {
  if (!Array.isArray(userIds) || userIds.length === 0) return []
  if (!settingKey) return []

  const preparedUserIds = Array.from(new Set(userIds.map(String).filter(Boolean)))
  if (preparedUserIds.length === 0) return []

  return await db
    .model('Users')
    .find({
      _id: { $in: preparedUserIds },
      [`notifications.settings.${settingKey}`]: true,
      $or: [
        {
          'notifications.telegram.active': true,
          'notifications.telegram.id': { $exists: true, $ne: null },
        },
        {
          'notifications.push.active': true,
          'notifications.push.subscriptions.0': { $exists: true },
        },
      ],
    })
    .lean()
}

export const notifyUsersAboutEventCancelStateForParticipants = async ({
  db,
  location,
  event,
  eventUsers = [],
  isCanceledNow = false,
}) => {
  const eventId = toObjectIdString(event?._id)
  if (!db || !location || !eventId) return

  const signedUserIds = Array.from(
    new Set(
      (Array.isArray(eventUsers) ? eventUsers : [])
        .map((eventUser) => String(eventUser?.userId || ''))
        .filter(Boolean)
    )
  )
  if (signedUserIds.length === 0) return

  const usersToNotify = await getUsersForOwnEventNotifications({
    db,
    userIds: signedUserIds,
    settingKey: 'eventCancel',
  })
  if (usersToNotify.length === 0) return

  const eventUrl = getEventUrl(location, eventId)
  const eventDate = formatDateTime(event?.dateStart)
  const stateText = isCanceledNow ? 'отменено' : 'возобновлено'
  const pushTitle = isCanceledNow
    ? 'Мероприятие отменено'
    : 'Мероприятие возобновлено'
  const text = `Мероприятие "${event?.title || 'Без названия'}"${
    eventDate ? ` от ${eventDate}` : ''
  } ${stateText}.`

  const telegramIds = usersToNotify
    .filter((user) => {
      const telegram = getUserTelegram(user)
      return Boolean(telegram?.active && telegram?.id)
    })
    .map((user) => getUserTelegram(user)?.id)
    .filter(Boolean)

  if (telegramIds.length > 0) {
    await sendTelegramMessage({
      telegramIds,
      text,
      inline_keyboard: [
        [
          {
            text: '\u{1F4C5} Мероприятие',
            url: eventUrl,
          },
        ],
      ],
      location,
    })
  }

  const usersWithPush = usersToNotify.filter((user) => supportsPushForUser(user))
  if (usersWithPush.length > 0) {
    await notifyUsersWithPush({
      db,
      location,
      users: usersWithPush,
      title: pushTitle,
      text: pushTextFromHtml(text),
      url: eventUrl,
      tag: `event-cancel-${eventId}-${isCanceledNow ? 'cancel' : 'resume'}`,
      notificationType: 'eventCancel',
      entities: {
        eventId,
        userIds: signedUserIds,
        status: isCanceledNow ? 'canceled' : 'active',
      },
    })
  }
}

export const notifyUsersAboutOwnEventMove = async ({
  db,
  location,
  event,
  moves = [],
}) => {
  const eventId = toObjectIdString(event?._id)
  if (!db || !location || !eventId) return
  if (!Array.isArray(moves) || moves.length === 0) return

  const allowedStatuses = new Set(['participant', 'reserve'])
  const normalizedMoves = moves
    .map((move) => ({
      userId: String(move?.userId || ''),
      fromStatus: String(move?.fromStatus || ''),
      toStatus: String(move?.toStatus || ''),
      subEventId: move?.subEventId || null,
    }))
    .filter(
      (move) =>
        move.userId &&
        allowedStatuses.has(move.fromStatus) &&
        allowedStatuses.has(move.toStatus) &&
        move.fromStatus !== move.toStatus
    )

  if (normalizedMoves.length === 0) return

  const usersToNotify = await getUsersForOwnEventNotifications({
    db,
    userIds: normalizedMoves.map((move) => move.userId),
    settingKey: 'eventUserMoves',
  })
  if (usersToNotify.length === 0) return

  const usersById = new Map(
    usersToNotify.map((user) => [String(user?._id || ''), user])
  )
  const eventUrl = getEventUrl(location, eventId)
  const eventDate = formatDateTime(event?.dateStart)

  for (const move of normalizedMoves) {
    const user = usersById.get(move.userId)
    if (!user) continue

    const moveText =
      move.toStatus === 'participant'
        ? 'переведена из резерва в основной состав'
        : 'переведена из основного состава в резерв'
    const subEventLabel = getEventSubEventLabel(event, move.subEventId)
    const text = `Ваша запись на мероприятие "${
      event?.title || 'Без названия'
    }"${eventDate ? ` от ${eventDate}` : ''} ${moveText}.${subEventLabel}`

    const telegram = getUserTelegram(user)
    if (telegram?.active && telegram?.id) {
      await sendTelegramMessage({
        telegramIds: telegram.id,
        text,
        inline_keyboard: [
          [
            {
              text: '\u{1F4C5} Мероприятие',
              url: eventUrl,
            },
          ],
        ],
        location,
      })
    }

    if (supportsPushForUser(user)) {
      await notifyUsersWithPush({
        db,
        location,
        users: [user],
        title: 'Изменение записи на мероприятие',
        text: pushTextFromHtml(text),
        url: eventUrl,
        tag: `event-move-${eventId}-${move.userId}`,
        notificationType: 'eventUserMoves',
        entities: {
          eventId,
          userId: move.userId,
        },
      })
    }
  }
}
