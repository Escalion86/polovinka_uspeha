import birthDateToAge from '@helpers/birthDateToAge'
import formatAddress from '@helpers/formatAddress'
import formatEventDateTime from '@helpers/formatEventDateTime'
import Events from '@models/Events'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import DOMPurify from 'isomorphic-dompurify'
import { DEFAULT_ROLES } from '@helpers/constants'
import Roles from '@models/Roles'
import subEventsSummator from '@helpers/subEventsSummator'
import { telegramCmdToIndex } from '@server/telegramCmd'
import sendTelegramMessage from '@server/sendTelegramMessage'

const notificateUsersAboutEvent = async (eventId, location, req) => {
  const db = await dbConnect(location)
  if (!db) return

  const event = await Events.findById(eventId).lean()
  if (!event || event.blank) return

  const rolesSettings = await Roles.find({}).lean()
  const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
  const rolesIdsToNewEventsByTagsNotification = allRoles
    .filter((role) => role?.notifications?.newEventsByTags)
    .map((role) => role._id)

  const users = await Users.find({
    role:
      process.env.MODE === 'dev'
        ? 'dev'
        : { $in: rolesIdsToNewEventsByTagsNotification },
    'notifications.settings.newEventsByTags': true,
    'notifications.telegram.active': true,
    'notifications.telegram.id': {
      $exists: true,
      $ne: null,
    },
  }).lean()

  const subEventSum = subEventsSummator(event.subEvents)

  const usersToNotificate = users.filter((user) => {
    if (
      !(
        !user.eventsTagsNotification ||
        user.eventsTagsNotification?.length === 0 ||
        user.eventsTagsNotification.find((tag) => event.tags.includes(tag))
      )
    )
      return false

    const userAge = new Number(
      birthDateToAge(user.birthday, undefined, false, false)
    )

    const isUserTooOld =
      userAge &&
      ((user.gender === 'male' &&
        typeof subEventSum.maxMansAge === 'number' &&
        subEventSum.maxMansAge < userAge) ||
        (user.gender === 'famale' &&
          typeof subEventSum.maxWomansAge === 'number' &&
          subEventSum.maxWomansAge < userAge))
    if (isUserTooOld) return false

    const isUserTooYoung =
      userAge &&
      ((user.gender === 'male' &&
        typeof subEventSum.maxMansAge === 'number' &&
        subEventSum.minMansAge > userAge) ||
        (user.gender === 'famale' &&
          typeof subEventSum.maxWomansAge === 'number' &&
          subEventSum.minWomansAge > userAge))
    if (isUserTooYoung) return false

    const isUserStatusCorrect = user.status
      ? subEventSum.usersStatusAccess[user.status]
      : subEventSum.usersStatusAccess.novice
    if (!isUserStatusCorrect) return false

    const isUserRelationshipCorrect =
      !subEventSum.usersRelationshipAccess ||
      subEventSum.usersRelationshipAccess === 'yes' ||
      (user.relationship
        ? subEventSum.usersRelationshipAccess === 'only'
        : subEventSum.usersRelationshipAccess === 'no')
    if (!isUserRelationshipCorrect) return false

    return true
  })

  if (usersToNotificate.length === 0) return

  const novicesTelegramIds = usersToNotificate
    .filter((user) => user.status === 'novice' || !user.status)
    .map((user) => user.notifications?.telegram?.id)

  const membersTelegramIds = usersToNotificate
    .filter((user) => user.status === 'member')
    .map((user) => user.notifications?.telegram?.id)

  // const eventPrice = subEventSum.price / 100
  // const eventPriceForMember =
  //   (subEventSum.price -
  //     (subEventSum.usersStatusDiscount ? subEventSum.usersStatusDiscount?.member : 0)) /
  //   100
  // const eventPriceForNovice =
  //   (subEventSum.price -
  //     (subEventSum.usersStatusDiscount ? subEventSum.usersStatusDiscount?.novice : 0)) /
  //   100

  const address = event.address
    ? `\n\n\u{1F4CD} <b>Место проведения</b>:\n${formatAddress(
        JSON.parse(JSON.stringify(event.address))
      )}`
    : ''

  const textStart = `\u{1F4C5} ${formatEventDateTime(event, {
    fullWeek: true,
    weekInBrackets: true,
  }).toUpperCase()}\n<b>${event.title}</b>\n${DOMPurify.sanitize(
    event.description
      .replaceAll('<p><br></p>', '\n')
      .replaceAll('<blockquote>', '\n<blockquote>')
      .replaceAll('<li>', '\n\u{2764} <li>')
      .replaceAll('<p>', '\n<p>')
      .replaceAll('<br>', '\n')
      .replaceAll('&nbsp;', ' ')
      .trim('\n'),
    {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }
  )}${address}`

  const textPriceForNovice = event.subEvents
    .map(({ price, usersStatusDiscount, title }, index) => {
      const eventPriceForStatus =
        ((price ?? 0) - (usersStatusDiscount.novice ?? 0)) / 100

      return `${index === 0 ? `\n\u{1F4B0} <b>Стоимость</b>:${event.subEvents.length > 1 ? '\n' : ''}` : ''}${event.subEvents.length > 1 ? ` - ${title}: ` : ' '}${
        usersStatusDiscount.novice > 0
          ? `<s>${price / 100}</s>   <b>${eventPriceForStatus}</b>`
          : eventPriceForStatus
      } руб`
    })
    .join('\n')

  const textPriceForMember = event.subEvents
    .map(({ price, usersStatusDiscount, title }, index) => {
      const eventPriceForStatus =
        ((price ?? 0) - (usersStatusDiscount.member ?? 0)) / 100

      return `${index === 0 ? `\n\u{1F4B0} <b>Стоимость</b>:${event.subEvents.length > 1 ? '\n' : ''}` : ''}${event.subEvents.length > 1 ? ` - ${title}: ` : ' '}${
        usersStatusDiscount.member > 0
          ? `<s>${price / 100}</s>   <b>${eventPriceForStatus}</b>`
          : eventPriceForStatus
      } руб`
    })
    .join('\n')

  // const textPriceForNovice = `\n\u{1F4B0} <b>Стоимость</b>: ${
  //   eventPriceForNovice !== eventPrice
  //     ? `<s>${eventPrice}</s>   <b>${eventPriceForNovice}</b>`
  //     : eventPriceForNovice
  // } руб`

  // const textPriceForMember = `\n\u{1F4B0} <b>Стоимость</b>: ${
  //   eventPriceForMember !== eventPrice
  //     ? `<s>${eventPrice}</s>   <b>${eventPriceForMember}</b>`
  //     : eventPriceForMember
  // } руб`

  const eventTags =
    typeof event.tags === 'object' && event.tags?.length > 0
      ? event.tags.filter((tag) => tag)
      : []
  const textEnd = eventTags.length > 0 ? `\n\n#${eventTags.join(' #')}` : ''

  const inline_keyboard = [
    [
      {
        text: '\u{1F4C5} На сайте',
        url: process.env.DOMAIN + '/event/' + String(event._id),
      },
      // TODO Исправить запись через телеграм
      // ---------------------------------------
      // {
      //   text: '\u{1F4DD} Записаться',
      //   callback_data: JSON.stringify({
      //     c: telegramCmdToIndex('eventSignIn'),
      //     eventId: event._id,
      //   }),
      // },
      // ---------------------------------------
    ],
  ]

  // TODO Исправить запись через телеграм
  const inline_keyboard2 = [
    [
      {
        text: '\u{1F4C5} На сайте',
        url: process.env.DOMAIN + '/event/' + String(event._id),
      },
      {
        text: '\u{1F4DD} Записаться',
        callback_data: JSON.stringify({
          c: telegramCmdToIndex('eventSignIn'),
          eventId: event._id,
        }),
      },
    ],
  ]
  // TODO Исправить запись через телеграм
  sendTelegramMessage({
    telegramIds: [261102161],
    text: textStart + textPriceForMember + textEnd,
    inline_keyboard: inline_keyboard2,
    location,
  })
  if (novicesTelegramIds.length > 0) {
    sendTelegramMessage({
      telegramIds: novicesTelegramIds,
      text: textStart + textPriceForNovice + textEnd,
      inline_keyboard,
      location,
    })
  }
  if (membersTelegramIds.length > 0) {
    sendTelegramMessage({
      telegramIds: membersTelegramIds.filter(
        (telegramId) => telegramId !== 261102161
      ),
      text: textStart + textPriceForMember + textEnd,
      inline_keyboard,
      location,
    })
  }

  return
}

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  delete query.location

  if (method === 'GET') {
    const eventId = query.eventId
    console.log('eventId: ', eventId)
    await notificateUsersAboutEvent(eventId, location, req)
    return res?.status(200).json({ success: true })
  }
  return res?.status(400).json({ success: false })
}
