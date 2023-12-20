import birthDateToAge from '@helpers/birthDateToAge'
import isEventCanceled from '@helpers/isEventCanceled'
import isEventClosed from '@helpers/isEventClosed'
import isEventExpired from '@helpers/isEventExpired'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
import Histories from '@models/Histories'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import eventUsersTelegramNotification from './eventUsersTelegramNotification'

const userSignIn = async ({
  req,
  res,
  userId,
  eventId,
  status,
  eventSubtypeNum,
  autoReserve = false,
}) => {
  try {
    await dbConnect()
    // Проверка что пользователь заполнил анкету и вообще существует
    const user = await Users.findById(userId)
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

    // Сначала проверяем есть ли такой пользователь в мероприятии
    const eventUser = await EventsUsers.findOne({ eventId, userId })
    if (eventUser) {
      const result = {
        success: false,
        data: { error: 'вы уже зарегистрированы на мероприятие' },
      }
      res?.status(202).json(result)
      return result
    }

    // Теперь проверяем есть ли место
    const event = await Events.findById(eventId)
    // Закрыто ли мероприятие?
    if (isEventClosed(event)) {
      const result = {
        success: false,
        data: {
          error: `мероприятие закрыто`,
        },
      }
      res?.status(202).json(result)
      return result
    }
    if (isEventExpired(event)) {
      const result = {
        success: false,
        data: {
          error: `мероприятие завершено`,
        },
      }
      res?.status(202).json(result)
      return result
    }
    if (isEventCanceled(event)) {
      const result = {
        success: false,
        data: {
          error: `мероприятие отменено`,
        },
      }
      res?.status(202).json(result)
      return result
    }

    // Проверяем параметры пользователя
    const userAge = new Number(
      birthDateToAge(user.birthday, new Date(), false, false)
    )

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
      const result = {
        success: false,
        data: {
          error: `ваш возраст не соответствует требованиям мероприятия`,
        },
      }
      res?.status(202).json(result)
      return result
    }

    const isUserStatusCorrect = user.status
      ? event.usersStatusAccess.get(user.status)
      : false

    if (!isUserStatusCorrect) {
      const result = {
        success: false,
        data: {
          error: `ваш статус не имеет допуска на мероприятие`,
        },
      }
      res?.status(202).json(result)
      return result
    }
    // Завершили проверку параметров пользователя

    const canSignInReserve =
      event.isReserveActive ?? DEFAULT_EVENT.isReserveActive

    var errorText
    // Если пользователь хочет зарегистрироваться в основной состав, то проверяем есть ли место
    if (!status || status === 'participant') {
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
      const eventParticipantsMans = eventParticipants.filter(
        (user) => user.gender === 'male'
      )
      const eventParticipantsWomans = eventParticipants.filter(
        (user) => user.gender === 'famale'
      )
      const eventParticipantsMansCount = eventParticipantsMans.length
      const eventParticipantsWomansCount = eventParticipantsWomans.length
      const eventParticipantsCount =
        eventParticipantsMansCount + eventParticipantsWomansCount

      // Если мероприятие забито
      if (
        typeof event.maxParticipants === 'number' &&
        event.maxParticipants <= eventParticipantsCount
      ) {
        errorText = `свободных мест на мероприятии уже нет`
      } else if (
        user.gender === 'male' &&
        typeof event.maxMans === 'number' &&
        event.maxMans <= eventParticipantsMansCount
      ) {
        errorText = `свободных мест для мужчин на мероприятии уже нет`
      } else if (
        user.gender === 'famale' &&
        typeof event.maxWomans === 'number' &&
        event.maxWomans <= eventParticipantsWomansCount
      ) {
        errorText = `свободных мест для женщин на мероприятии уже нет`
      }
      // Проверям места для клуба/центра
      if (!errorText) {
        // Если пользователь мужчина
        if (user.gender === 'male') {
          if (!user.status || user.status === 'novice') {
            const eventParticipantsNoviceMansCount =
              eventParticipantsMans.filter(
                (user) => !user.status || user.status === 'novice'
              ).length
            if (eventParticipantsNoviceMansCount >= event.maxMansNovice) {
              errorText = `свободных мест для мужчин из центра уже нет`
            }
          } else if (!user.status || user.status === 'member') {
            const eventParticipantsMemberMansCount =
              eventParticipantsMans.filter(
                (user) => user.status === 'member'
              ).length
            if (eventParticipantsMemberMansCount >= event.maxMansMemeber) {
              errorText = `свободных мест для мужчин из клуба уже нет`
            }
          }
          // Если пользователь женщина
        } else if (user.gender === 'famale') {
          if (!user.status || user.status === 'novice') {
            const eventParticipantsNoviceWomansCount =
              eventParticipantsWomans.filter(
                (user) => !user.status || user.status === 'novice'
              ).length
            if (eventParticipantsNoviceWomansCount >= event.maxWomansNovice) {
              errorText = `свободных мест для женщин из центра уже нет`
            }
          } else if (!user.status || user.status === 'member') {
            const eventParticipantsMemberWomansCount =
              eventParticipantsWomans.filter(
                (user) => user.status === 'member'
              ).length
            if (eventParticipantsMemberWomansCount >= event.maxWomansMemeber) {
              errorText = `свободных мест для женщин из клуба уже нет`
            }
          }
        }
      }

      if (errorText) {
        if (!autoReserve || !canSignInReserve) {
          const result = {
            success: false,
            data: {
              error: errorText,
              solution: canSignInReserve ? 'reserve' : undefined,
            },
          }
          res?.status(202).json(result)
          return result
        }
      }
    }

    const resultStatus =
      (!status || status === 'participant') &&
      errorText &&
      autoReserve &&
      canSignInReserve
        ? 'reserve'
        : errorText && canSignInReserve
        ? 'reserve'
        : status

    const newEventUser = await EventsUsers.create({
      eventId,
      userId,
      status: resultStatus ?? 'participant',
      userStatus: user?.status,
      eventSubtypeNum,
    })

    if (!newEventUser) {
      const result = {
        success: false,
        data: { error: `на сервере не удалось создать запись на мероприятие` },
      }
      res?.status(400).json(result)
      return result
    }

    await Histories.create({
      schema: EventsUsers.collection.collectionName,
      action: 'add',
      data: newEventUser,
      userId,
    })

    // Оповещение в телеграм
    await eventUsersTelegramNotification({
      req,
      eventId,
      addedEventUsers: [newEventUser.toJSON()],
      itIsSelfRecord: true,
    })

    const result = { success: true, data: newEventUser }
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
