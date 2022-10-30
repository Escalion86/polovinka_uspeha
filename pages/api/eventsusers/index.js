import { postData } from '@helpers/CRUD'
import formatDateTime from '@helpers/formatDateTime'
import getUserFullName from '@helpers/getUserFullName'
import isUserAdmin from '@helpers/isUserAdmin'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
import Histories from '@models/Histories'
import Users from '@models/Users'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

// Оповещение в телеграм
const telegramNotification = async ({
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
    // Если зарегистрировался один пользователь
    if (
      itIsSelfRecord &&
      deletedEventUsers.length === 1 &&
      addedEventUsers.length === 0
    ) {
      const { user, status } = deletedEventUsersFull[0]
      text = `${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
        user
      )} ${user.gender === 'male' ? 'отписался' : 'отписалась'} ${
        status === 'reserve' ? 'из резерва мероприятия' : 'от мероприятия'
      } "${event.title}" от ${formatDateTime(event.dateStart)}.`
    } else if (
      itIsSelfRecord &&
      deletedEventUsers.length === 0 &&
      addedEventUsers.length === 1
    ) {
      const { user, status } = addedEventUsersFull[0]
      text = `${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
        user
      )} ${user.gender === 'male' ? 'записался' : 'записалась'} ${
        status === 'reserve' ? 'в резерв мероприятия' : 'на мероприятие'
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
          ? `\nРезерв: ♂️  ${mansReserveCount}  |  ♀️  ${womansReserveCount} | Всего: ${
              mansReserveCount + womansReserveCount
            }`
          : `\nЗапись в резерв закрыта`
      }`

    const usersTelegramIds = usersWithTelegramNotificationsON
      .filter(
        (user) =>
          isUserAdmin(user) &&
          user.notifications?.get('telegram').active &&
          user.notifications?.get('telegram')?.id
      )
      .map((user) => user.notifications?.get('telegram')?.id)
    await Promise.all(
      usersTelegramIds.map(async (telegramId) => {
        await postData(
          `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
          {
            chat_id: telegramId,
            text,
            parse_mode: 'html',
            reply_markup:
              req.headers.origin.substr(0, 5) === 'https'
                ? JSON.stringify({
                    inline_keyboard: [
                      [
                        {
                          text: 'Открыть мероприятие',
                          url: req.headers.origin + '/event/' + eventId,
                        },
                      ],
                    ],
                  })
                : undefined,
          },
          (data) => console.log('data', data),
          (data) => console.log('error', data),
          true
        )
      })
    )
  }
}

export default async function handler(req, res) {
  const { query, method, body } = req

  await dbConnect()
  if (method === 'POST') {
    try {
      // const { eventId, usersId, userId, eventUsersStatuses } = body
      const { eventId, eventUsersStatuses, userId, status } = body

      if (!eventId)
        return res?.status(400).json({ success: false, data: 'No eventId' })
      if (eventUsersStatuses) {
        if (typeof eventUsersStatuses !== 'object')
          return res
            ?.status(400)
            .json({ success: false, data: 'error eventUsersStatuses data' })

        // Сравниваем участников что были с теми что пришли
        const eventUsers = await EventsUsers.find({ eventId })
        const oldEventUsers = eventUsers.filter((eventUser) =>
          eventUsersStatuses.find(
            (data) =>
              // data.eventId === eventUser.eventId &&
              data.userId === eventUser.userId &&
              data.status === eventUser.status
          )
        )
        const addedEventUsers = eventUsersStatuses.filter(
          (eventUser) =>
            !eventUsers.find(
              (data) =>
                // data.eventId === eventUser.eventId &&
                data.userId === eventUser.userId &&
                data.status === eventUser.status
            )
        )
        const deletedEventUsers = eventUsers.filter(
          (eventUser) =>
            !eventUsersStatuses.find(
              (data) =>
                // data.eventId === eventUser.eventId &&
                data.userId === eventUser.userId &&
                data.status === eventUser.status
            )
        )

        // Удаляем тех кого больше нет
        for (let i = 0; i < deletedEventUsers.length; i++) {
          await EventsUsers.deleteOne({
            eventId,
            userId: deletedEventUsers[i].userId,
          })
        }

        // console.log('req', req)
        // console.log('req.headers', req.headers.origin)
        if (deletedEventUsers.length > 0) {
          await Histories.create({
            schema: 'EventsUsers',
            action: 'delete',
            data: deletedEventUsers,
          })
        }

        // await fetch(
        //   'https://api.telegram.org/bot5754011496:AAHPhp0PilD8Il1s9y2wt4GQRiOjvTnHO0w/sendMessage?chat_id=261102161&text=приветб как ДЕла?'
        // )

        const data = []
        for (let i = 0; i < addedEventUsers.length; i++) {
          const newEventUser = await EventsUsers.create({
            eventId,
            userId: addedEventUsers[i].userId,
            status: addedEventUsers[i].status,
          })
          data.push(newEventUser)
        }

        if (data.length > 0)
          await Histories.create({ schema: 'EventsUsers', action: 'add', data })

        // Оповещение в телеграм
        // const deletedUsersIds = deletedEventUsers.map(
        //   (eventUser) => eventUser.userId
        // )
        // const addedUsersIds = addedEventUsers.map((eventUser) => eventUser.userId)
        await telegramNotification({
          req,
          eventId,
          deletedEventUsers,
          addedEventUsers,
          eventUsers,
        })

        return res
          ?.status(201)
          .json({ success: true, data: [...oldEventUsers, ...data] })
      }
      if (userId) {
        // Сначала проверяем есть ли такой пользователь в мероприятии
        const eventUser = await EventsUsers.findOne({ eventId, userId })
        if (eventUser) {
          return res?.status(200).json({
            success: false,
            data: { error: 'User already registered' },
          })
        }

        const newEventUser = await EventsUsers.create({
          eventId,
          userId,
          status: status ?? 'participant',
        })

        if (!newEventUser) {
          return res?.status(400).json({
            success: false,
            data: { error: `Can't create user registration on event` },
          })
        }

        await Histories.create({
          schema: 'EventsUsers',
          action: 'add',
          data: newEventUser,
        })

        // Оповещение в телеграм
        await telegramNotification({
          req,
          eventId,
          addedEventUsers: [newEventUser.toJSON()],
          itIsSelfRecord: true,
        })

        return res?.status(201).json({ success: true, data: newEventUser })
      }

      // if (usersId && typeof usersId === 'object') {
      //   // Сначала удаляем всех участников мероприятия
      //   await EventsUsers.deleteMany({ eventId })
      //   const data = []
      //   for (let i = 0; i < usersId.length; i++) {
      //     const userId = usersId[i]
      //     const newEventUser = await EventsUsers.create({
      //       eventId,
      //       userId,
      //     })
      //     data.push(newEventUser)
      //   }
      //   return res?.status(201).json({ success: true, data })
      // }
      // return res?.status(400).json({ success: false, data: 'No usersId' })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  if (method === 'DELETE') {
    try {
      if (!body?.params)
        return res
          ?.status(200)
          .json({ success: false, data: { error: 'No params' } })
      const { eventId, userId } = body.params
      // Сначала проверяем есть ли такой пользователь в мероприятии
      const eventUser = await EventsUsers.findOne({ eventId, userId })
      if (!eventUser) {
        return res
          ?.status(200)
          .json({ success: false, data: { error: 'Not find user in event' } })
      }

      await EventsUsers.deleteMany({
        eventId,
        userId,
      })

      await Histories.create({
        schema: 'EventsUsers',
        action: 'delete',
        data: eventUser,
      })

      // Оповещение в телеграм
      await telegramNotification({
        req,
        eventId,
        deletedEventUsers: [eventUser.toJSON()],
        itIsSelfRecord: true,
      })
      // if (process.env.MONGODB_URI) {
      //   const event = await Events.findById(eventId)
      //   const deletedUsersIds = [userId]

      //   const users = await Users.find({})
      //   const deletedUsers = users.filter((user) =>
      //     deletedUsersIds.includes(user._id.toString())
      //   )
      //   const deletedUsersNames = deletedUsers.map((user) =>
      //     getUserFullName(user)
      //   )

      //   const text = `Изменение списка участников в мероприятии "${
      //     event.title
      //   }" от ${formatDateTime(event.dateStart)}.${
      //     deletedUsersNames.length > 0
      //       ? `\n\nОтписались:\n${deletedUsersNames
      //           .map((name) => `  - ${name}`)
      //           .join(',\n')}`
      //       : ''
      //   }`

      //   const usersTelegramIds = users
      //     .filter(
      //       (user) =>
      //         isUserAdmin(user) &&
      //         user.notifications?.get('telegram').active &&
      //         user.notifications?.get('telegram')?.id
      //     )
      //     .map((user) => user.notifications?.get('telegram')?.id)
      //   await Promise.all(
      //     usersTelegramIds.map(async (telegramId) => {
      //       await postData(
      //         `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      //         {
      //           chat_id: telegramId,
      //           text,
      //           parse_mode: 'html',
      //           reply_markup: JSON.stringify({
      //             inline_keyboard: [
      //               [
      //                 {
      //                   text: 'Открыть мероприятие',
      //                   // url: 'https://www.google.com',
      //                   url: req.headers.origin + '/event/' + eventId,
      //                 },
      //               ],
      //             ],
      //           }),
      //         }
      //       )
      //     })
      //   )
      // }

      return res?.status(201).json({ success: true, data: eventUser })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  return await CRUD(EventsUsers, req, res)
}
