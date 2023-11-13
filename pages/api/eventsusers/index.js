import EventsUsers from '@models/EventsUsers'
import Histories from '@models/Histories'
import Users from '@models/Users'
import CRUD from '@server/CRUD'
import eventUsersTelegramNotification from '@server/eventUsersTelegramNotification'
import userSignIn from '@server/userSignIn'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  if (method === 'POST') {
    try {
      await dbConnect()
      // const { eventId, usersId, userId, eventUsersStatuses } = body
      const {
        // _id,
        eventId,
        eventUsersStatuses,
        userId,
        status,
        eventSubtypeNum,
        comment,
      } = body.data
      // console.log('body.data', body.data)

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
            schema: EventsUsers.collection.collectionName,
            action: 'delete',
            data: deletedEventUsers,
            userId: body.userId,
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
        })

        return res
          ?.status(201)
          .json({ success: true, data: [...oldEventUsers, ...data] })
      }
      if (userId && eventId) {
        return await userSignIn({
          req,
          res,
          userId,
          eventId,
          status,
          eventSubtypeNum,
        })
      }
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  if (method === 'DELETE') {
    try {
      await dbConnect()
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
        schema: EventsUsers.collection.collectionName,
        action: 'delete',
        data: eventUser,
        userId: body.userId,
      })

      // Оповещение в телеграм
      await eventUsersTelegramNotification({
        req,
        eventId,
        deletedEventUsers: [eventUser.toJSON()],
        itIsSelfRecord: true,
      })

      return res?.status(201).json({ success: true, data: eventUser })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  return await CRUD(EventsUsers, req, res)
}
