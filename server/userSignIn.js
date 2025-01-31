// import birthDateToAge from '@helpers/birthDateToAge'
import isEventCanceled from '@helpers/isEventCanceled'
import isEventClosed from '@helpers/isEventClosed'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'

import dbConnect from '@utils/dbConnect'
import eventUsersTelegramNotification from './eventUsersTelegramNotification'
import isEventExpired from './isEventExpired'
import userToEventStatus from '@helpers/userToEventStatus'
import subEventsSummator from '@helpers/subEventsSummator'

const userSignIn = async ({
  req,
  res,
  userId,
  eventId,
  status,
  subEventId,
  autoReserve = false,
  location,
}) => {
  try {
    const db = await dbConnect(location)
    if (!db) return res?.status(400).json({ success: false, error: 'db error' })

    // Проверка что пользователь заполнил анкету и вообще существует
    const user = await db.model('Users').findById(userId).lean()
    if (!user) {
      const result = {
        success: false,
        data: { error: `пользователя не существует` },
      }
      res?.status(400).json(result)
      return result
    }

    if (!isUserQuestionnaireFilled(user)) {
      const result = {
        success: false,
        data: { error: `анкета пользователя не заполнена` },
      }
      res?.status(400).json(result)
      return result
    }

    // Теперь проверяем есть ли место
    const event = await db.model('Events').findById(eventId).lean()

    if (!event) {
      const result = {
        success: false,
        data: {
          error: `мероприятие удалено`,
        },
      }
      res?.status(400).json(result)
      return result
    }
    // Сначала проверяем есть ли такой пользователь в мероприятии
    const eventUser = await db
      .model('EventsUsers')
      .findOne({ eventId, userId })
      .lean()

    if (eventUser) {
      const result = {
        success: false,
        data: { error: 'вы уже зарегистрированы на мероприятие' },
      }
      res?.status(400).json(result)
      return result
    }

    if (!event.showOnSite) {
      const result = {
        success: false,
        data: {
          error: `мероприятие закрыто для записи`,
        },
      }
      res?.status(400).json(result)
      return result
    }
    // Скрыто ли мероприятие?
    if (event.blank) {
      const result = {
        success: false,
        data: {
          error: `мероприятие пустое, на него невозможно записаться`,
        },
      }
      res?.status(400).json(result)
      return result
    }
    // Закрыто ли мероприятие?
    if (isEventExpired(event)) {
      const result = {
        success: false,
        data: {
          error: `мероприятие завершено`,
        },
      }
      res?.status(400).json(result)
      return result
    }

    if (isEventCanceled(event)) {
      const result = {
        success: false,
        data: {
          error: `мероприятие отменено`,
        },
      }
      res?.status(400).json(result)
      return result
    }
    if (isEventClosed(event)) {
      const result = {
        success: false,
        data: {
          error: `мероприятие закрыто`,
        },
      }
      res?.status(400).json(result)
      return result
    }
    const subEvent = subEventId
      ? event.subEvents.find(({ id }) => subEventId === id)
      : event.subEvents[0]
    if (!subEvent) {
      const result = {
        success: false,
        data: {
          error: `не найден вариант участия в мероприятии`,
        },
      }
      res?.status(202).json(result)
      return result
    }
    const eventUsers = await db.model('EventsUsers').find({ eventId }).lean()
    const usersIds = eventUsers.map((eventUser) => eventUser.userId)
    const users = await db
      .model('Users')
      .find({ _id: { $in: usersIds } })
      .lean()
    const eventUsersFull = eventUsers.map((eventUser) => {
      const user = users.find(
        (user) => user._id.toString() === eventUser.userId
      )
      return { ...eventUser, user }
    })

    const subEventSum = subEventsSummator([subEvent])
    const direction = await db
      .model('Directions')
      .findById(event.directionId)
      .lean()
    const rules = direction?.rules
    const userEventStatus = userToEventStatus({
      event,
      user,
      eventUsersFull,
      subEventSum,
      rules,
    })

    console.log('userEventStatus', userEventStatus)

    // TODO FIX Сделать проверку на возможность зарегистрироваться на суб мероприятие
    // Проверяем параметры пользователя
    // const userAge = new Number(
    //   birthDateToAge(user.birthday, new Date(), false, false)
    // )

    // const isUserTooOld =
    //   userAge &&
    //   ((user.gender === 'male' &&
    //     typeof subEvent.maxMansAge === 'number' &&
    //     subEvent.maxMansAge < userAge) ||
    //     (user.gender === 'famale' &&
    //       typeof subEvent.maxWomansAge === 'number' &&
    //       subEvent.maxWomansAge < userAge))

    // const isUserTooYoung =
    //   userAge &&
    //   ((user.gender === 'male' &&
    //     typeof subEvent.maxMansAge === 'number' &&
    //     subEvent.minMansAge > userAge) ||
    //     (user.gender === 'famale' &&
    //       typeof subEvent.maxWomansAge === 'number' &&
    //       subEvent.minWomansAge > userAge))

    // const isAgeOfUserCorrect = !isUserTooOld && !isUserTooYoung
    // if (!isAgeOfUserCorrect) {
    if (!userEventStatus.isAgeOfUserCorrect) {
      const result = {
        success: false,
        data: {
          error: `ваш возраст не соответствует требованиям мероприятия`,
        },
      }
      res?.status(202).json(result)
      return result
    }

    // const isUserStatusCorrect = user.status
    //   ? subEvent.usersStatusAccess[user.status]
    //   : false

    // if (!isUserStatusCorrect) {
    if (!userEventStatus.isUserStatusCorrect) {
      const result = {
        success: false,
        data: {
          error: `ваш статус не имеет допуска на мероприятие`,
        },
      }
      res?.status(202).json(result)
      return result
    }

    if (!userEventStatus.isUserRelationshipCorrect) {
      const result = {
        success: false,
        data: {
          error: `ваш статус отношений не имеет допуска на мероприятие`,
        },
      }
      res?.status(202).json(result)
      return result
    }

    if (!userEventStatus.canSignIn) {
      if (userEventStatus.canSignInReserve) {
        if (!autoReserve && status !== 'reserve') {
          const result = {
            success: false,
            data: {
              error: `нет мест, но вы можете зарегистрироваться в резерв через сайт`,
              solution: 'reserve',
            },
          }
          res?.status(202).json(result)
          return result
        }
      } else {
        const result = {
          success: false,
          data: {
            error: `нет мест`,
          },
        }
        res?.status(202).json(result)
        return result
      }
    }

    // status: 'event full',
    // status: 'event full of mans',
    // status: 'event full of womans',
    // status: 'event full of novice mans',
    // status: 'event full of member mans',
    // status: 'event full of novice womans',
    // status: 'event full of member womans',

    // Завершили проверку параметров пользователя
    // const canSignInReserve =
    //   subEvent.isReserveActive ?? DEFAULT_EVENT.isReserveActive

    // var errorText
    // // // Если пользователь хочет зарегистрироваться в основной состав, то проверяем есть ли место
    // if (!status || status === 'participant') {
    //   const subEventUsersParticipants = await db.model('EventsUsers').find({
    //     eventId,
    //     status: 'participant',
    //     subEventId: subEvent.id,
    //   })
    //   const subEventParticipantsIds = subEventUsersParticipants.map(
    //     (eventUser) => eventUser.userId
    //   )
    //   const subEventParticipants = await db.model('Users').find({
    //     _id: { $in: subEventParticipantsIds },
    //   })
    //   const subEventParticipantsMans = subEventParticipants.filter(
    //     (user) => user.gender === 'male'
    //   )
    //   const subEventParticipantsWomans = subEventParticipants.filter(
    //     (user) => user.gender === 'famale'
    //   )
    //   const subEventParticipantsMansCount = subEventParticipantsMans.length
    //   const subEventParticipantsWomansCount = subEventParticipantsWomans.length
    //   const subEventParticipantsCount =
    //     subEventParticipantsMansCount + subEventParticipantsWomansCount

    //   // Если мероприятие забито
    //   if (
    //     typeof subEvent.maxParticipants === 'number' &&
    //     subEvent.maxParticipants <= subEventParticipantsCount
    //   ) {
    //     errorText = `свободных мест на мероприятии уже нет`
    //   } else if (
    //     user.gender === 'male' &&
    //     typeof subEvent.maxMans === 'number' &&
    //     subEvent.maxMans <= subEventParticipantsMansCount
    //   ) {
    //     errorText = `свободных мест для мужчин на мероприятии уже нет`
    //   } else if (
    //     user.gender === 'famale' &&
    //     typeof subEvent.maxWomans === 'number' &&
    //     subEvent.maxWomans <= subEventParticipantsWomansCount
    //   ) {
    //     errorText = `свободных мест для женщин на мероприятии уже нет`
    //   }

    //   // Проверям места для клуба/центра
    //   if (!errorText) {
    //     // Если пользователь мужчина
    //     if (user.gender === 'male') {
    //       if (!user.status || user.status === 'novice') {
    //         if (typeof subEvent.maxMansNovice === 'number') {
    //           const subEventParticipantsNoviceMansCount =
    //             subEventParticipantsMans.filter(
    //               (user) => !user.status || user.status === 'novice'
    //             ).length
    //           if (
    //             subEventParticipantsNoviceMansCount >= subEvent.maxMansNovice
    //           ) {
    //             errorText = `свободных мест для мужчин из центра уже нет`
    //           }
    //         }
    //       } else if (!user.status || user.status === 'member') {
    //         if (typeof subEvent.maxMansMember === 'number') {
    //           const subEventParticipantsMemberMansCount =
    //             subEventParticipantsMans.filter(
    //               (user) => user.status === 'member'
    //             ).length
    //           if (
    //             subEventParticipantsMemberMansCount >= subEvent.maxMansMember
    //           ) {
    //             errorText = `свободных мест для мужчин из клуба уже нет`
    //           }
    //         }
    //       }
    //       // Если пользователь женщина
    //     } else if (user.gender === 'famale') {
    //       if (!user.status || user.status === 'novice') {
    //         if (typeof subEvent.maxWomansNovice === 'number') {
    //           const subEventParticipantsNoviceWomansCount =
    //             subEventParticipantsWomans.filter(
    //               (user) => !user.status || user.status === 'novice'
    //             ).length
    //           if (
    //             subEventParticipantsNoviceWomansCount >=
    //             subEvent.maxWomansNovice
    //           ) {
    //             errorText = `свободных мест для женщин из центра уже нет`
    //           }
    //         }
    //       } else if (!user.status || user.status === 'member') {
    //         if (typeof subEvent.maxWomansMember === 'number') {
    //           const subEventParticipantsMemberWomansCount =
    //             subEventParticipantsWomans.filter(
    //               (user) => user.status === 'member'
    //             ).length
    //           if (
    //             subEventParticipantsMemberWomansCount >=
    //             subEvent.maxWomansMember
    //           ) {
    //             errorText = `свободных мест для женщин из клуба уже нет`
    //           }
    //         }
    //       }
    //     }
    //   }

    //   if (errorText) {
    //     if (!autoReserve || !canSignInReserve) {
    //       const result = {
    //         success: false,
    //         data: {
    //           error: errorText,
    //           solution: canSignInReserve ? 'reserve' : undefined,
    //         },
    //       }
    //       res?.status(202).json(result)
    //       return result
    //     }
    //   }
    // }

    // const resultStatus =
    //   (!status || status === 'participant') &&
    //   errorText &&
    //   autoReserve &&
    //   canSignInReserve
    //     ? 'reserve'
    //     : errorText && canSignInReserve
    //       ? 'reserve'
    //       : status

    // const result = {
    //   success: true,
    //   data: {
    //     error: `нет мест, но вы зарегистрированы В РЕЗЕРВ`,
    //     status: 'reserve',
    //   },
    // }
    // res?.status(202).json(result)
    // return result

    const realStatus = !userEventStatus.canSignIn ? 'reserve' : status

    const newEventUser = await db.model('EventsUsers').create({
      eventId,
      userId,
      status: realStatus,
      // status ??
      // // resultStatus
      // 'participant',
      userStatus: user?.status,
      subEventId: subEvent.id,
    })

    if (!newEventUser) {
      const result = {
        success: false,
        data: { error: `на сервере не удалось создать запись на мероприятие` },
      }
      res?.status(400).json(result)
      return result
    }

    const newEventUserJson = newEventUser.toJSON()

    await db.model('Histories').create({
      schema: EventsUsers.collection.collectionName,
      action: 'add',
      data: newEventUserJson,
      userId,
    })

    // Оповещение в телеграм
    await eventUsersTelegramNotification({
      req,
      eventId,
      addedEventUsers: [newEventUserJson],
      itIsSelfRecord: true,
      location,
    })

    const result = { success: true, data: newEventUserJson }
    res?.status(201).json(result)
    return result
  } catch (error) {
    const result = {
      success: false,
      data: { error: error.message },
    }
    res?.status(400).json(result)
    return result
  }
}

export default userSignIn
