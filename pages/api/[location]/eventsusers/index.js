import EventsUsers from '@models/EventsUsers'
import Histories from '@models/Histories'
import Users from '@models/Users'
import CRUD from '@server/CRUD'
import eventUsersTelegramNotification from '@server/eventUsersTelegramNotification'
import userSignIn from '@server/userSignIn'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

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
        if (typeof eventUsersStatuses !== 'object')
          return res
            ?.status(400)
            .json({ success: false, data: 'error eventUsersStatuses data' })

        // Сравниваем участников что были с теми что пришли
        const eventUsers = await EventsUsers.find({ eventId }).lean()
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

        const addedUsers = await Users.find({
          _id: { $in: addedUsersIds },
        }).lean()

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
          await EventsUsers.deleteOne({
            eventId,
            userId: deletedEventUsers[i].userId,
          })
        }

        if (deletedEventUsers.length > 0) {
          await Histories.create({
            schema: EventsUsers.collection.collectionName,
            action: 'delete',
            data: deletedEventUsers,
            userId: body.userId,
          })
        }

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
            subEventId: addedEventUsers[i].subEventId,
          })
          data.push(newEventUser)
        }

        if (data.length > 0)
          await Histories.create({
            schema: EventsUsers.collection.collectionName,
            action: 'add',
            data,
            userId: body.userId,
          })

        // Оповещение в телеграм
        // const deletedUsersIds = deletedEventUsers.map(
        //   (eventUser) => eventUser.userId
        // )
        // const addedUsersIds = addedEventUsers.map((eventUser) => eventUser.userId)
        await eventUsersTelegramNotification({
          req,
          eventId,
          deletedEventUsers,
          addedEventUsers,
          eventUsers,
          location,
        })

        return res
          ?.status(201)
          .json({ success: true, data: [...oldEventUsers, ...data] })
      }
      // Пользователь регистрируется лично
      if (userId && eventId) {
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
          const updatedEventUser = await EventsUsers.findByIdAndUpdate(
            id,
            {
              [key]: value,
            },
            { new: true }
          )
          result.push(updatedEventUser)
        }
      }

      return res?.status(201).json({ success: true, data: result })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  if (method === 'DELETE') {
    try {
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
      const eventUser = await EventsUsers.findOne({ eventId, userId }).lean()
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
        schema: EventsUsers.collection.collectionName,
        action: 'delete',
        data: eventUser,
        userId: body.userId,
      })

      // Оповещение в телеграм
      await eventUsersTelegramNotification({
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
  return await CRUD(EventsUsers, req, res)
}
