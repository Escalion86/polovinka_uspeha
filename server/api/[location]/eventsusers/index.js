import checkLocationValid from '@server/checkLocationValid'
import CRUD from '@server/CRUD'
import eventUsersTelegramNotification from '@server/eventUsersTelegramNotification'
import userSignIn from '@server/userSignIn'
import dbConnect from '@utils/dbConnect'
import assertCityOperationAllowed from '@server/assertCityOperationAllowed'
import { syncEventUsersGoogleCalendar } from '@server/userGoogleCalendar'
import { notifyUsersAboutOwnEventMove } from '@server/userEventNotifications'

const resolvePrimarySignupStatus = (eventUsers = []) => {
  if (!Array.isArray(eventUsers) || eventUsers.length === 0) return null
  if (eventUsers.some((eventUser) => eventUser?.status === 'participant')) {
    return 'participant'
  }
  if (eventUsers.some((eventUser) => eventUser?.status === 'reserve')) {
    return 'reserve'
  }
  return null
}

const collectSignupStatusByUserId = (eventUsers = []) => {
  const byUserId = new Map()
  for (const eventUser of eventUsers) {
    const userId = String(eventUser?.userId || '')
    if (!userId) continue
    const current = byUserId.get(userId) || []
    current.push(eventUser)
    byUserId.set(userId, current)
  }

  const result = new Map()
  for (const [userId, items] of byUserId.entries()) {
    result.set(userId, resolvePrimarySignupStatus(items))
  }
  return result
}

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  if (method === 'POST') {
    try {
      delete query.location

      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })
      // const { eventId, usersId, userId, eventUsersStatuses } = body
      const {
        // _id,
        eventId,
        eventUsersStatuses,
        userId,
        status,
        subEventId,
        comment,
      } = body.data

      if (!eventId)
        return res?.status(400).json({ success: false, data: 'No eventId' })

      // Пакетное изменение
      if (eventUsersStatuses) {
        const eventManagementGuard = await assertCityOperationAllowed(
          location,
          'event_management'
        )
        if (!eventManagementGuard.success) {
          return res?.status(403).json(eventManagementGuard)
        }

        if (typeof eventUsersStatuses !== 'object')
          return res
            ?.status(400)
            .json({ success: false, data: 'error eventUsersStatuses data' })

        // Сравниваем участников что были с теми что пришли
        const eventUsers = await db
          .model('EventsUsers')
          .find({ eventId })
          .lean()

        const oldStatusByUserId = collectSignupStatusByUserId(eventUsers)
        const newStatusByUserId = collectSignupStatusByUserId(eventUsersStatuses)
        const oldEventUsers = eventUsers.filter((eventUser) =>
          eventUsersStatuses.find(
            (data) =>
              // data.eventId === eventUser.eventId &&
              data.userId === eventUser.userId &&
              data.status === eventUser.status &&
              data.subEventId === eventUser.subEventId
          )
        )

        const addedEventUsers = eventUsersStatuses.filter(
          (eventUser) =>
            !eventUsers.find(
              (data) =>
                // data.eventId === eventUser.eventId &&
                data.userId === eventUser.userId &&
                data.status === eventUser.status &&
                data.subEventId === eventUser.subEventId
            )
        )

        const addedUsersIds = eventUsersStatuses.map(
          (eventUser) => eventUser.userId
        )

        const addedUsers = await db
          .model('Users')
          .find({
            _id: { $in: addedUsersIds },
          })
          .lean()

        const deletedEventUsers = eventUsers.filter(
          (eventUser) =>
            !eventUsersStatuses.find(
              (data) =>
                // data.eventId === eventUser.eventId &&
                data.userId === eventUser.userId &&
                data.status === eventUser.status &&
                data.subEventId === eventUser.subEventId
            )
        )

        // Удаляем тех кого больше нет
        for (let i = 0; i < deletedEventUsers.length; i++) {
          await db.model('EventsUsers').deleteOne({
            eventId,
            userId: deletedEventUsers[i].userId,
          })
        }

        if (deletedEventUsers.length > 0) {
          await db.model('Histories').create({
            schema: 'EventsUsers'.toLowerCase(),
            action: 'delete',
            data: deletedEventUsers,
            userId: body.userId,
          })

          await syncEventUsersGoogleCalendar({
            db,
            location,
            eventUsers: deletedEventUsers,
            forceDelete: true,
          })
        }

        const data = []
        for (let i = 0; i < addedEventUsers.length; i++) {
          const user = addedUsers.find(
            (user) => user._id.toString() === addedEventUsers[i].userId
          )
          const newEventUser = await db.model('EventsUsers').create({
            eventId,
            userId: addedEventUsers[i].userId,
            status: addedEventUsers[i].status,
            userStatus: user?.status,
            subEventId: addedEventUsers[i].subEventId,
          })
          data.push(newEventUser)
        }

        if (data.length > 0)
          await db.model('Histories').create({
            schema: 'EventsUsers'.toLowerCase(),
            action: 'add',
            data,
            userId: body.userId,
          })

        if (data.length > 0) {
          await syncEventUsersGoogleCalendar({
            db,
            location,
            eventUsers: data.map((item) =>
              typeof item?.toJSON === 'function' ? item.toJSON() : item
            ),
          })
        }

        // Оповещение в телеграм
        // const deletedUsersIds = deletedEventUsers.map(
        //   (eventUser) => eventUser.userId
        // )
        // const addedUsersIds = addedEventUsers.map((eventUser) => eventUser.userId)
        eventUsersTelegramNotification({
          req,
          eventId,
          deletedEventUsers,
          addedEventUsers,
          notificationOnMassiveChange: true,
          location,
        })

        const movedUsers = []
        const allUserIds = new Set([
          ...oldStatusByUserId.keys(),
          ...newStatusByUserId.keys(),
        ])
        for (const movedUserId of allUserIds) {
          const oldStatus = oldStatusByUserId.get(movedUserId)
          const newStatus = newStatusByUserId.get(movedUserId)
          if (
            !['participant', 'reserve'].includes(oldStatus) ||
            !['participant', 'reserve'].includes(newStatus) ||
            oldStatus === newStatus
          ) {
            continue
          }

          const nextRow = eventUsersStatuses.find(
            (item) =>
              String(item?.userId || '') === movedUserId &&
              item?.status === newStatus
          )
          const prevRow = eventUsers.find(
            (item) =>
              String(item?.userId || '') === movedUserId &&
              item?.status === oldStatus
          )

          movedUsers.push({
            userId: movedUserId,
            fromStatus: oldStatus,
            toStatus: newStatus,
            subEventId: nextRow?.subEventId || prevRow?.subEventId || null,
          })
        }

        if (movedUsers.length > 0) {
          const event = await db.model('Events').findById(eventId).lean()
          await notifyUsersAboutOwnEventMove({
            db,
            location,
            event,
            moves: movedUsers,
          })
        }

        return res
          ?.status(201)
          .json({ success: true, data: [...oldEventUsers, ...data] })
      }
      // Пользователь регистрируется лично
      if (userId && eventId) {
        const eventSignupGuard = await assertCityOperationAllowed(
          location,
          'event_signup'
        )
        if (!eventSignupGuard.success) {
          return res?.status(403).json(eventSignupGuard)
        }

        return await userSignIn({
          req,
          res,
          userId,
          eventId,
          status,
          subEventId,
          location,
        })
      }
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  if (method === 'PUT') {
    try {
      const eventManagementGuard = await assertCityOperationAllowed(
        location,
        'event_management'
      )
      if (!eventManagementGuard.success) {
        return res?.status(403).json(eventManagementGuard)
      }

      delete query.location

      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })

      const { data } = body.data
      if (!data)
        return res?.status(400).json({ success: false, data: 'No data' })

      if (typeof data !== 'object')
        return res
          ?.status(400)
          .json({ success: false, data: 'error data not an object' })

      const dataKeys = Object.keys(data)
      const result = []
      for (const key of dataKeys) {
        for (const [id, value] of Object.entries(data[key])) {
          const updatedEventUser = await db
            .model('EventsUsers')
            .findByIdAndUpdate(
              id,
              {
                [key]: value,
              },
              { returnDocument: 'after' }
            )
          result.push(updatedEventUser)
        }
      }

      if (result.length > 0) {
        await syncEventUsersGoogleCalendar({
          db,
          location,
          eventUsers: result.map((item) =>
            typeof item?.toJSON === 'function' ? item.toJSON() : item
          ),
        })
      }

      return res?.status(201).json({ success: true, data: result })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  if (method === 'DELETE') {
    try {
      const eventSignupGuard = await assertCityOperationAllowed(
        location,
        'event_signup'
      )
      if (!eventSignupGuard.success) {
        return res?.status(403).json(eventSignupGuard)
      }

      delete query.location

      const db = await dbConnect(location)
      if (!db)
        return res?.status(400).json({ success: false, error: 'db error' })
      if (!body?.params)
        return res
          ?.status(200)
          .json({ success: false, data: { error: 'No params' } })
      const { eventId, userId } = body.params
      // Сначала проверяем есть ли такой пользователь в мероприятии
      const eventUser = await db
        .model('EventsUsers')
        .findOne({ eventId, userId })
        .lean()
      if (!eventUser) {
        return res
          ?.status(200)
          .json({ success: false, data: { error: 'Not find user in event' } })
      }

      await db.model('EventsUsers').deleteMany({
        eventId,
        userId,
      })

      await db.model('Histories').create({
        schema: 'EventsUsers'.toLowerCase(),
        action: 'delete',
        data: eventUser,
        userId: body.userId,
      })

      await syncEventUsersGoogleCalendar({
        db,
        location,
        eventUsers: [eventUser],
        forceDelete: true,
      })

      // Оповещение в телеграм
      eventUsersTelegramNotification({
        req,
        eventId,
        deletedEventUsers: [eventUser],
        itIsSelfRecord: true,
        location,
      })

      return res?.status(201).json({ success: true, data: eventUser })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  return await CRUD('EventsUsers', req, res)
}
