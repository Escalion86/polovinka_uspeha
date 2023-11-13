import formatDateTimeFunc from '@helpers/formatDateTime'
import getUserFullName from '@helpers/getUserFullName'
import isUserModer from '@helpers/isUserModer'
import isUserAdmin from '@helpers/isUserAdmin'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
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
    process.env.MONGODB_URI &&
    eventId &&
    ((!itIsSelfRecord &&
      notificationOnMassiveChange &&
      deletedEventUsers.length + addedEventUsers.length > 0) ||
      (itIsSelfRecord &&
        addedEventUsers.length + deletedEventUsers.length === 1))
  ) {
    await dbConnect()

    // Получаем список подписанных на уведомления, и если их нет, то выходим сразу
    const usersWithTelegramNotificationsON = await Users.find({
      'notifications.telegram.active': true,
      'notifications.telegram.id': {
        $exists: true,
        $ne: null,
      },
    })
    if (
      !usersWithTelegramNotificationsON ||
      usersWithTelegramNotificationsON?.length === 0
    )
      return

    const event = await Events.findById(eventId)
    const eventUsers = await EventsUsers.find({ eventId })
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

    const users = await Users.find({ _id: { $in: usersIds } })
    const eventUsersFull = eventUsers.map((eventUser) => {
      const user = users.find(
        (user) => user._id.toString() === eventUser.userId
      )
      return { ...eventUser.toJSON(), user }
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
      const { user, status } = deletedEventUsersFull[0]
      userId = user._id
      text = `\u{2796}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
        user
      )} ${user.status === 'member' ? '(клуб) ' : ''}<b>${
        user.gender === 'male' ? 'ОТПИСАЛСЯ' : 'ОТПИСАЛАСЬ'
      }</b> ${
        status === 'reserve'
          ? '<b>ИЗ РЕЗЕРВА</b> мероприятия'
          : 'от мероприятия'
      } "${event.title}" от ${formatDateTime(event.dateStart)}.`
    } else if (
      itIsSelfRecord &&
      deletedEventUsers.length === 0 &&
      addedEventUsers.length === 1
    ) {
      const { user, status } = addedEventUsersFull[0]
      userId = user._id
      text = `\u{2795}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
        user
      )} ${user.status === 'member' ? '(клуб) ' : ''}<b>${
        user.gender === 'male' ? `ЗАПИСАЛСЯ` : 'ЗАПИСАЛАСЬ'
      }</b> ${
        status === 'reserve' ? '<b>В РЕЗЕРВ</b> мероприятия' : 'на мероприятие'
      } "${event.title}" от ${formatDateTime(event.dateStart)}.`
    } else if (notificationOnMassiveChange) {
      // const deletedUsersNames = deletedUsers.map((user) =>
      //   getUserFullName(user)
      // )
      // const addedUsersNames = addedUsers.map((user) => getUserFullName(user))

      text = `Изменение списка участников в мероприятии "${
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
    // console.log('req.protocol', req.headers.origin.substr(0, 5))

    text +=
      `\n\nУчастники: ♂️  ${mansParticipantsCount}${
        event.maxMans ? ' / ' + event.maxMans : ''
      }  |  ♀️  ${womansParticipantsCount}${
        event.maxWomans ? ' / ' + event.maxWomans : ''
      }  |  Всего: ${mansParticipantsCount + womansParticipantsCount}` +
      `${
        event.isReserveActive
          ? `\nРезерв: ♂️  ${mansReserveCount}  |  ♀️  ${womansReserveCount}  |  Всего: ${
              mansReserveCount + womansReserveCount
            }`
          : `\nЗапись в резерв закрыта`
      }`

    const usersTelegramIds = usersWithTelegramNotificationsON
      .filter(
        (user) =>
          (isUserModer(user) || isUserAdmin(user)) &&
          user.notifications?.get('settings')?.eventRegistration &&
          user.notifications?.get('telegram')?.active &&
          user.notifications?.get('telegram')?.id
      )
      .map((user) => user.notifications?.get('telegram')?.id)

    await sendTelegramMessage({
      req,
      telegramIds: usersTelegramIds,
      text,
      inline_keyboard: [
        [
          {
            text: '\u{1F4C5} Мероприятие',
            url: req.headers.origin + '/event/' + eventId,
          },
          userId
            ? {
                text: '\u{1F464} Пользователь',
                url: req.headers.origin + '/user/' + userId,
              }
            : undefined,
        ],
      ],
    })

    // await Promise.all(
    //   usersTelegramIds.map(async (telegramId) => {
    //     await postData(
    //       `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
    //       {
    //         chat_id: telegramId,
    //         text,
    //         parse_mode: 'html',
    //         reply_markup:
    //           req.headers.origin.substr(0, 5) === 'https'
    //             ? JSON.stringify({
    //                 inline_keyboard: [
    //                   [
    //                     {
    //                       text: '\u{1F4C5} Мероприятие',
    //                       url: req.headers.origin + '/event/' + eventId,
    //                     },
    //                     userId
    //                       ? {
    //                           text: '\u{1F464} Пользователь',
    //                           url: req.headers.origin + '/user/' + userId,
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
