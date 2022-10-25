import { postData } from '@helpers/CRUD'
import getUserFullName from '@helpers/getUserFullName'
import Events from '@models/Events'
import EventsUsers from '@models/EventsUsers'
import Histories from '@models/Histories'
import Users from '@models/Users'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'
import mongoose from 'mongoose'

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

        // console.log('req', req)
        // console.log('req.headers', req.headers.origin)
        if (deletedEventUsers.length > 0) {
          await Histories.create({
            schema: 'EventsUsers',
            action: 'delete',
            data: deletedEventUsers,
          })
          if (process.env.MONGODB_URI) {
            const event = Events.findById(eventId)
            const usersIds = deletedEventUsers.map(async (eventUser) =>
              mongoose.Types.ObjectId(eventUser.userId)
            )
            // const users = await Users.find({
            //   _id: { $in: usersIds },
            // })
            const users = await Users.find({})
            const deletedUsersNames = users
              .filter((user) => usersIds.includes(user._id))
              .map((user) => getUserFullName(user))
            const isOne = deletedUsersNames.length === 1

            const text = `Пользовател${
              isOne ? 'ь' : 'и'
            } ${deletedUsersNames.join(', ')} отпис${
              isOne ? 'ан' : 'аны'
            } с мероприятия "${event.title}".\n
              ${req.headers.origin + '/event/' + eventId}
              `

            const usersTelegramIds = users
              .filter(
                (user) =>
                  isUserAdmin(user) && user.notifications?.get('telegram')?.id
              )
              .map((user) => user.notifications?.get('telegram')?.id)
            await Promise.all(
              usersTelegramIds.map(async (telegramId) => {
                await postData(
                  `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
                  {
                    chat_id: telegramId,
                    text,
                  }
                  // (data) => console.log('data', data),
                  // (data) => console.log('error', data),
                  // true
                )
              })
            )
          }
        }

        // await fetch(
        //   'https://api.telegram.org/bot5754011496:AAHPhp0PilD8Il1s9y2wt4GQRiOjvTnHO0w/sendMessage?chat_id=261102161&text=приветб как ДЕла?'
        // )

        const data = []
        for (let i = 0; i < newEventUsers.length; i++) {
          const newEventUser = await EventsUsers.create({
            eventId,
            userId: newEventUsers[i].userId,
            status: newEventUsers[i].status,
          })
          data.push(newEventUser)
        }

        if (data.length > 0)
          await Histories.create({ schema: 'EventsUsers', action: 'add', data })

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

      return res?.status(201).json({ success: true, data: eventUser })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  return await CRUD(EventsUsers, req, res)
}
