import { DEFAULT_ROLES } from '@helpers/constants'
import formatDateTimeFunc from '@helpers/formatDateTime'
import getUserFullName from '@helpers/getUserFullName'
import subEventsSummator from '@helpers/subEventsSummator'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
import Roles from '@models/Roles'
import Users from '@models/Users'
import sendTelegramMessage from '@server/sendTelegramMessage'
import dbConnect from '@utils/dbConnect'

function convertTZ(date, tzString = 'Asia/Krasnoyarsk') {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tzString,
    })
  )
}

const formatDateTime = (date) => formatDateTimeFunc(convertTZ(date))

// Оповещение в телеграм
const eventUsersTelegramNotification = async ({
  req,
  eventId,
  deletedEventUsers = [],
  addedEventUsers = [],
  itIsSelfRecord = false,
  notificationOnMassiveChange = false,
}) => {
  if (
    eventId &&
    ((!itIsSelfRecord &&
      notificationOnMassiveChange &&
      deletedEventUsers.length + addedEventUsers.length > 0) ||
      (itIsSelfRecord &&
        addedEventUsers.length + deletedEventUsers.length === 1))
  ) {
    await dbConnect()
    const rolesSettings = await Roles.find({})
    const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
    const rolesIdsToEventUsersNotification = allRoles
      .filter((role) => role?.notifications?.eventRegistration)
      .map((role) => role._id)

    // Получаем список подписанных на уведомления, и если их нет, то выходим сразу
    const usersWithTelegramNotificationsOfEventUsersON = await Users.find({
      role:
        process.env.NODE_ENV === 'development'
          ? 'dev'
          : { $in: rolesIdsToEventUsersNotification },
      'notifications.settings.eventRegistration': true,
      'notifications.telegram.active': true,
      'notifications.telegram.id': {
        $exists: true,
        $ne: null,
      },
    }).lean()

    if (
      !usersWithTelegramNotificationsOfEventUsersON ||
      usersWithTelegramNotificationsOfEventUsersON?.length === 0
    )
      return

    const event = await Events.findById(eventId).lean()
    const eventUsers = await EventsUsers.find({ eventId }).lean()
    const eventUsersIds = eventUsers.map((eventUser) => eventUser.userId)

    // const addedEventUsersIds = addedEventUsers.map(
    //   (eventUser) => eventUser.userId
    // )
    const deletedEventUsersIds = deletedEventUsers.map(
      (eventUser) => eventUser.userId
    )

    const usersIds = [
      ...eventUsersIds,
      // ...addedEventUsersIds,
      ...deletedEventUsersIds,
    ]

    const users = await Users.find({ _id: { $in: usersIds } }).lean()
    const eventUsersFull = eventUsers.map((eventUser) => {
      const user = users.find(
        (user) => user._id.toString() === eventUser.userId
      )
      return { ...eventUser, user }
    })
    const deletedEventUsersFull = deletedEventUsers.map((eventUser) => {
      const user = users.find(
        (user) => user._id.toString() === eventUser.userId
      )
      return { ...eventUser, user }
    })
    const addedEventUsersFull = addedEventUsers.map((eventUser) => {
      const user = users.find(
        (user) => user._id.toString() === eventUser.userId
      )
      return { ...eventUser, user }
    })

    var text
    var userId
    // Если зарегистрировался один пользователь
    if (
      itIsSelfRecord &&
      deletedEventUsers.length === 1 &&
      addedEventUsers.length === 0
    ) {
      const { user, status, subEventId } = deletedEventUsersFull[0]
      const subEventName =
        subEventId && event.subEvents?.length > 1
          ? event.subEvents.find(({ id }) => id === subEventId)?.title
          : undefined
      userId = user._id
      text = `\u{1F4C5}\u{2796}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
        user
      )} ${user.status === 'member' ? '(клуб) ' : ''}<b>${
        user.gender === 'male' ? 'ОТПИСАЛСЯ' : 'ОТПИСАЛАСЬ'
      }</b> ${
        status === 'reserve'
          ? '<b>ИЗ РЕЗЕРВА</b> мероприятия'
          : 'от мероприятия'
      } "${event.title}" от ${formatDateTime(event.dateStart)}${subEventName ? ` (${subEventName})` : ''}.`
    } else if (
      itIsSelfRecord &&
      deletedEventUsers.length === 0 &&
      addedEventUsers.length === 1
    ) {
      const { user, status, subEventId } = addedEventUsersFull[0]
      const subEventName =
        subEventId && event.subEvents?.length > 1
          ? event.subEvents.find(({ id }) => id === subEventId)?.title
          : undefined
      userId = user._id
      text = `\u{1F4C5}\u{2795}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
        user
      )} ${user.status === 'member' ? '(клуб) ' : ''}<b>${
        user.gender === 'male' ? `ЗАПИСАЛСЯ` : 'ЗАПИСАЛАСЬ'
      }</b> ${
        status === 'reserve' ? '<b>В РЕЗЕРВ</b> мероприятия' : 'на мероприятие'
      } "${event.title}" от ${formatDateTime(event.dateStart)}${subEventName ? ` (${subEventName})` : ''}.`
    } else if (notificationOnMassiveChange) {
      // const deletedUsersNames = deletedUsers.map((user) =>
      //   getUserFullName(user)
      // )
      // const addedUsersNames = addedUsers.map((user) => getUserFullName(user))

      text = `\u{1F4C5} Изменение списка участников в мероприятии "${
        event.title
      }" от ${formatDateTime(event.dateStart)}.${
        addedEventUsersFull.length > 0
          ? `\n\nЗаписались:\n${addedEventUsersFull
              .map(
                (eventUser) =>
                  `  - ${
                    eventUser.user.gender === 'male' ? '♂️' : '♀️'
                  } ${getUserFullName(eventUser.user)}${
                    eventUser.status === 'reserve' ? ' (в резерв)' : ''
                  }`
              )
              .join(',\n')}`
          : ''
      }${
        deletedEventUsersFull.length > 0
          ? `\n\nОтписались:\n${deletedEventUsersFull
              .map(
                (eventUser) =>
                  `  - ${
                    eventUser.user.gender === 'male' ? '♂️' : '♀️'
                  } ${getUserFullName(eventUser.user)}${
                    eventUser.status === 'reserve' ? ' (из резерва)' : ''
                  }`
              )
              .join(',\n')}`
          : ''
      }`
    }
    // const newEventUsers = [
    //   ...eventUsersFull.filter(
    //     (eventUser) => !deletedEventUsersIds.includes(eventUser.userId)
    //   ),
    //   ...addedEventUsersFull,
    // ]

    // console.log(
    //   'newEventUsers',
    //   newEventUsers.map((eventUser) => eventUser.user.gender)
    // )

    // console.log('eventUsersFull', eventUsersFull)

    const mans = eventUsersFull.filter(
      (eventUser) => eventUser.user.gender === 'male'
    )
    const womans = eventUsersFull.filter(
      (eventUser) => eventUser.user.gender === 'famale'
    )
    const mansParticipantsCount = mans.filter(
      (eventUser) => eventUser.status === 'participant'
    ).length
    const womansParticipantsCount = womans.filter(
      (eventUser) => eventUser.status === 'participant'
    ).length
    const mansReserveCount = mans.filter(
      (eventUser) => eventUser.status === 'reserve'
    ).length
    const womansReserveCount = womans.filter(
      (eventUser) => eventUser.status === 'reserve'
    ).length
    // console.log('req.protocol', process.env.DOMAIN.substr(0, 5))

    text += `\n`

    if (event.subEvents?.length > 1) {
      for (let i = 0; i < event.subEvents.length; i++) {
        const subEvent = event.subEvents[i]
        const subEventSum = subEventsSummator([subEvent])
        const mansInSubEvent = eventUsersFull.filter(
          (eventUser) =>
            eventUser.user.gender === 'male' &&
            eventUser.subEventId === subEvent.id
        )
        const womansInSubEvent = eventUsersFull.filter(
          (eventUser) =>
            eventUser.user.gender === 'famale' &&
            eventUser.subEventId === subEvent.id
        )

        const mansParticipantsInSubEventCount = mansInSubEvent.filter(
          (eventUser) => eventUser.status === 'participant'
        ).length
        const womansParticipantsInSubEventCount = womansInSubEvent.filter(
          (eventUser) => eventUser.status === 'participant'
        ).length
        const mansReserveInSubEventCount = mansInSubEvent.filter(
          (eventUser) => eventUser.status === 'reserve'
        ).length
        const womansReserveInSubEventCount = womansInSubEvent.filter(
          (eventUser) => eventUser.status === 'reserve'
        ).length

        text +=
          `\n<b>${subEvent.title}</b>:\nУчастники: ♂️  ${mansParticipantsInSubEventCount}${
            subEventSum.maxMans ? ' / ' + subEventSum.maxMans : ''
          }  |  ♀️  ${womansParticipantsInSubEventCount}${
            subEventSum.maxWomans ? ' / ' + subEventSum.maxWomans : ''
          }  |  Всего: ${mansParticipantsInSubEventCount + womansParticipantsInSubEventCount}` +
          `${
            subEventSum.isReserveActive
              ? `\nРезерв: ♂️  ${mansReserveInSubEventCount}  |  ♀️  ${womansReserveInSubEventCount}  |  Всего: ${
                  mansReserveCount + womansReserveInSubEventCount
                }`
              : `\nЗапись в резерв закрыта`
          }`
      }
    }

    const subEventsSum = subEventsSummator(event.subEvents)

    text +=
      `\n${event.subEvents?.length > 1 ? `<b>ИТОГО</b>:\n` : ''}Участники: ♂️  ${mansParticipantsCount}${
        subEventsSum.maxMans ? ' / ' + subEventsSum.maxMans : ''
      }  |  ♀️  ${womansParticipantsCount}${
        subEventsSum.maxWomans ? ' / ' + subEventsSum.maxWomans : ''
      }  |  Всего: ${mansParticipantsCount + womansParticipantsCount}` +
      `${
        subEventsSum.isReserveActive
          ? `\nРезерв: ♂️  ${mansReserveCount}  |  ♀️  ${womansReserveCount}  |  Всего: ${
              mansReserveCount + womansReserveCount
            }`
          : `\nЗапись в резерв закрыта`
      }`

    const usersTelegramIds = usersWithTelegramNotificationsOfEventUsersON.map(
      (user) => user.notifications?.telegram?.id
    )

    const result = await sendTelegramMessage({
      telegramIds: usersTelegramIds,
      text,
      inline_keyboard: [
        [
          {
            text: '\u{1F4C5} Мероприятие',
            url: process.env.DOMAIN + '/event/' + eventId,
          },
          userId
            ? {
                text: '\u{1F464} Пользователь',
                url: process.env.DOMAIN + '/user/' + userId,
              }
            : undefined,
        ],
      ],
    })

    return result

    // await Promise.all(
    //   usersTelegramIds.map(async (telegramId) => {
    //     await postData(
    //       `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    //       {
    //         chat_id: telegramId,
    //         text,
    //         parse_mode: 'html',
    //         reply_markup:
    //           process.env.DOMAIN.substr(0, 5) === 'https'
    //             ? JSON.stringify({
    //                 inline_keyboard: [
    //                   [
    //                     {
    //                       text: '\u{1F4C5} Мероприятие',
    //                       url: process.env.DOMAIN + '/event/' + eventId,
    //                     },
    //                     userId
    //                       ? {
    //                           text: '\u{1F464} Пользователь',
    //                           url: process.env.DOMAIN + '/user/' + userId,
    //                         }
    //                       : undefined,
    //                   ],
    //                 ].filter((botton) => botton),
    //               })
    //             : undefined,
    //       },
    //       (data) => console.log('data', data),
    //       (data) => console.log('error', data),
    //       true,
    //       null,
    //       true
    //     )
    //   })
    // )
  }
}

export default eventUsersTelegramNotification
