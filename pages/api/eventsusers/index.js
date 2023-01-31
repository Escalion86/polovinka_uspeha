import birthDateToAge from '@helpers/birthDateToAge'
import { postData } from '@helpers/CRUD'
import formatDateTime from '@helpers/formatDateTime'
import getUserFullName from '@helpers/getUserFullName'
import isEventCanceled from '@helpers/isEventCanceled'
import isEventClosed from '@helpers/isEventClosed'
import isEventExpired from '@helpers/isEventExpired'
import isUserAdmin from '@helpers/isUserAdmin'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
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
      text = `\u{2796}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
        user
      )} <b>${user.gender === 'male' ? 'ОТПИСАЛСЯ' : 'ОТПИСАЛАСЬ'}</b> ${
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
      text = `\u{2795}${user.gender === 'male' ? '♂️' : '♀️'} ${getUserFullName(
        user
      )} <b>${user.gender === 'male' ? `ЗАПИСАЛСЯ` : 'ЗАПИСАЛАСЬ'}</b> ${
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
      const {
        // _id,
        eventId,
        eventUsersStatuses,
        userId,
        status,
        eventSubtypeNum,
        comment,
      } = body

      // if (_id) {
      //   return await CRUD(EventsUsers, req, res)
      // }

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

        const addedUsersIds = eventUsersStatuses.map(
          (eventUser) => eventUser.userId
        )

        const addedUsers = await Users.find({ _id: { $in: addedUsersIds } })

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
          const user = addedUsers.find(
            (user) => user._id.toString() === addedEventUsers[i].userId
          )
          const newEventUser = await EventsUsers.create({
            eventId,
            userId: addedEventUsers[i].userId,
            status: addedEventUsers[i].status,
            userStatus: user?.status,
            eventSubtypeNum,
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
      if (userId && eventId) {
        // Проверка что пользователь заполнил анкету и вообще существует
        const user = await Users.findById(userId)
        if (!user) {
          return res?.status(400).json({
            success: false,
            data: { error: `пользователя не существует` },
          })
        }
        if (!isUserQuestionnaireFilled(user)) {
          return res?.status(400).json({
            success: false,
            data: { error: `анкета пользователя не заполнена` },
          })
        }

        // Сначала проверяем есть ли такой пользователь в мероприятии
        const eventUser = await EventsUsers.findOne({ eventId, userId })
        if (eventUser) {
          return res?.status(202).json({
            success: false,
            data: { error: 'вы уже зарегистрированы' },
          })
        }

        // TODO сделать проверку что пользователь заполнил анкету

        // Теперь проверяем есть ли место
        const event = await Events.findById(eventId)
        // Закрыто ли мероприятие?
        if (isEventClosed(event)) {
          return res?.status(202).json({
            success: false,
            data: {
              error: `мероприятие закрыто`,
            },
          })
        }
        if (isEventExpired(event)) {
          return res?.status(202).json({
            success: false,
            data: {
              error: `мероприятие завершено`,
            },
          })
        }
        if (isEventCanceled(event)) {
          return res?.status(202).json({
            success: false,
            data: {
              error: `мероприятие отменено`,
            },
          })
        }
        // Проверяем параметры пользователя
        const userAge = new Number(birthDateToAge(user.birthday, false, false))

        const isUserTooOld =
          userAge &&
          ((user.gender === 'male' &&
            typeof event.maxMansAge === 'number' &&
            event.maxMansAge < userAge) ||
            (user.gender === 'famale' &&
              typeof event.maxWomansAge === 'number' &&
              event.maxWomansAge < userAge))

        const isUserTooYoung =
          userAge &&
          ((user.gender === 'male' &&
            typeof event.maxMansAge === 'number' &&
            event.minMansAge > userAge) ||
            (user.gender === 'famale' &&
              typeof event.maxWomansAge === 'number' &&
              event.minWomansAge > userAge))

        const isAgeOfUserCorrect = !isUserTooOld && !isUserTooYoung

        if (!isAgeOfUserCorrect) {
          return res?.status(202).json({
            success: false,
            data: {
              error: `ваш возраст не соответствует требованиям`,
            },
          })
        }

        const isUserStatusCorrect = user.status
          ? event.usersStatusAccess.get(user.status)
          : false

        if (!isUserStatusCorrect) {
          return res?.status(202).json({
            success: false,
            data: {
              error: `ваш статус не имеет допуска на мероприятие`,
            },
          })
        }
        // Завершили проверку параметров пользователя

        // Если пользователь хочет зарегистрироваться в основной состав, то проверяем есть ли место
        if (!status || status === 'participant') {
          const canSignInReserve =
            event.isReserveActive ?? DEFAULT_EVENT.isReserveActive

          const eventUsersParticipants = await EventsUsers.find({
            eventId,
            status: 'participant',
          })
          const eventParticipantsIds = eventUsersParticipants.map(
            (eventUser) => eventUser.userId
          )
          const eventParticipants = await Users.find({
            _id: { $in: eventParticipantsIds },
          })
          const eventParticipantsMansCount = eventParticipants.filter(
            (user) => user.gender === 'male'
          ).length
          const eventParticipantsWomansCount = eventParticipants.filter(
            (user) => user.gender === 'famale'
          ).length
          const eventParticipantsCount =
            eventParticipantsMansCount + eventParticipantsWomansCount

          var errorText
          // Если мероприятие забито
          if (
            typeof event.maxParticipants === 'number' &&
            event.maxParticipants <= eventParticipantsCount
          ) {
            errorText = `свободных мест уже нет`
          } else if (
            user.gender === 'male' &&
            typeof event.maxMans === 'number' &&
            event.maxMans <= eventParticipantsMansCount
          ) {
            errorText = `свободных мест для мужчин уже нет`
          }

          if (
            user.gender === 'famale' &&
            typeof event.maxWomans === 'number' &&
            event.maxWomans <= eventParticipantsWomansCount
          ) {
            errorText = `свободных мест для женщин уже нет`
          }

          if (errorText) {
            return res?.status(202).json({
              success: false,
              data: {
                error: errorText,
                solution: canSignInReserve ? 'reserve' : undefined,
              },
            })
          }
        }

        const newEventUser = await EventsUsers.create({
          eventId,
          userId,
          status: status ?? 'participant',
          userStatus: user?.status,
          eventSubtypeNum,
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
