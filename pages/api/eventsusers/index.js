import EventsUsers from '@models/EventsUsers'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

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
        const newEventUsers = eventUsersStatuses.filter(
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

        const data = [...oldEventUsers]
        for (let i = 0; i < newEventUsers.length; i++) {
          const newEventUser = await EventsUsers.create({
            eventId,
            userId: newEventUsers[i].userId,
            status: newEventUsers[i].status,
          })
          data.push(newEventUser)
        }
        return res?.status(201).json({ success: true, data })
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

      return res?.status(201).json({ success: true, data: eventUser })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  return await CRUD(EventsUsers, req, res)
}
