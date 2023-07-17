import birthDateToAge from '@helpers/birthDateToAge'
import { postData } from '@helpers/CRUD'
import formatAddress from '@helpers/formatAddress'
// import formatDate from '@helpers/formatDate'
import getUserFullName from '@helpers/getUserFullName'
import isUserAdmin from '@helpers/isUserAdmin'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import Events from '@models/Events'
import Histories from '@models/Histories'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

const { google } = require('googleapis')
const SCOPES = ['https://www.googleapis.com/auth/calendar']
const {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PROJECT_NUMBER,
  GOOGLE_CALENDAR_ID,
} = process.env

const connectToGoogleCalendar = () => {
  const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
  )

  const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient,
  })

  return calendar
}

const addBlankEventToCalendar = async () => {
  const calendar = connectToGoogleCalendar()

  const calendarEvent = {
    summary: '[blank]',
    description: '',
    start: {
      dateTime: new Date(),
      timeZone: 'Asia/Krasnoyarsk',
    },
    end: {
      dateTime: new Date(),
      timeZone: 'Asia/Krasnoyarsk',
    },
    attendees: [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: './google_calendar_token.json',
    scopes: SCOPES,
  })

  const authProcess = await auth.getClient()

  const calendarEventData = await new Promise((resolve, reject) => {
    calendar.events.insert(
      {
        auth: authProcess,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: calendarEvent,
      },
      (error, result) => {
        if (error) {
          console.log({ error })
          reject(error)
          // res.send(JSON.stringify({ error: error }))
        } else {
          if (result) {
            console.log(result)
            resolve(result)
            // res.send(JSON.stringify({ events: result.data.items }))
          } else {
            console.log({ message: 'Что-то пошло не так' })
            reject('Что-то пошло не так')
            // res.send(JSON.stringify({ message: 'No upcoming events found.' }))
          }
        }
      }
    )
  })

  console.log('calendarEventData :>> ', calendarEventData)

  return calendarEventData?.data?.id
}

const deleteEventFromCalendar = async (googleCalendarId) => {
  if (!googleCalendarId) return

  const calendar = connectToGoogleCalendar()

  const auth = new google.auth.GoogleAuth({
    keyFile: './google_calendar_token.json',
    scopes: SCOPES,
  })

  const authProcess = await auth.getClient()

  return calendar.events.delete({
    auth: authProcess,
    calendarId: GOOGLE_CALENDAR_ID,
    eventId: googleCalendarId,
  })
}

const updateEventInCalendar = async (event) => {
  const calendar = connectToGoogleCalendar()

  // calendar.events.list(
  //   {
  //     calendarId: GOOGLE_CALENDAR_ID,
  //     timeMin: new Date().toISOString(),
  //     maxResults: 10,
  //     singleEvents: true,
  //     orderBy: 'startTime',
  //   },
  //   (error, result) => {
  //     if (error) {
  //       console.log({ error })
  //       // res.send(JSON.stringify({ error: error }))
  //     } else {
  //       if (result.data.items.length) {
  //         console.log({ events: result.data.items })
  //         // res.send(JSON.stringify({ events: result.data.items }))
  //       } else {
  //         console.log({ message: 'No upcoming events found.' })
  //         // res.send(JSON.stringify({ message: 'No upcoming events found.' }))
  //       }
  //     }
  //   }
  // )

  const calendarEvent = {
    summary: `${event.showOnSite ? '' : '[СКРЫТО] '}${
      event.status === 'canceled' ? '[ОТМЕНЕНО] ' : ''
    }${event.title}`,
    description: event.description,
    start: {
      dateTime: event.dateStart,
      timeZone: 'Asia/Krasnoyarsk',
    },
    end: {
      dateTime: event.dateEnd,
      timeZone: 'Asia/Krasnoyarsk',
    },
    location: formatAddress(event.address),
    attendees: [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
    visibility: event.showOnSite ? 'default' : 'private',
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: './google_calendar_token.json',
    scopes: SCOPES,
  })

  const authProcess = await auth.getClient()

  if (!event.googleCalendarId) {
    console.log('Создаем новое событие в календаре')
    const createdCalendarEvent = calendar.events.insert(
      {
        auth: authProcess,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: calendarEvent,
      }
      // function (error, response) {
      //   if (error) {
      //     console.log('Something went wrong: ' + error) // If there is an error, log it to the console
      //     return
      //   }
      //   console.log('Event created successfully.')
      //   console.log('Event details: ', response.data) // Log the event details
      // }
    )
    await dbConnect()
    await Events.findByIdAndUpdate(
      event._id,
      { ...event, googleCalendarId: createdCalendarEvent.id },
      {
        new: true,
        runValidators: true,
      }
    )

    return createdCalendarEvent
  }
  console.log('Обновляем событие в календаре')

  return calendar.events.update({
    auth: authProcess,
    calendarId: GOOGLE_CALENDAR_ID,
    eventId: event.googleCalendarId ?? undefined,
    resource: calendarEvent,
  })
}

export default async function handler(Schema, req, res, params = null) {
  const { query, method, body } = req

  const id = query?.id

  await dbConnect()

  let data
  console.log('Schema', Schema)
  console.log(`method`, method)
  console.log(`params`, params)
  console.log(`id`, id)
  console.log(`body`, body)

  switch (method) {
    case 'GET':
      try {
        if (params) {
          data = await Schema.find(params).select({ password: 0 })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (id) {
          data = await Schema.findById(id).select({ password: 0 })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else {
          data = await Schema.find().select({ password: 0 })
          return res?.status(200).json({ success: true, data })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    case 'POST':
      try {
        if (id) {
          return res
            ?.status(400)
            .json({ success: false, error: 'No need to set Id' })
        } else {
          const clearedBody = { ...body.data }
          delete clearedBody._id
          var calendarEventId
          if (Schema === Events) {
            calendarEventId = await addBlankEventToCalendar()
            console.log('calendarEventId :>> ', calendarEventId)
            clearedBody.googleCalendarId = calendarEventId
          }

          data = await Schema.create(clearedBody)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          if (Schema === Events) {
            // console.log('data :>> ', data)
            const calendarEvent = updateEventInCalendar(data)
          }

          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'add',
            data,
            userId: body.userId,
          })

          return res?.status(201).json({ success: true, data })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    case 'PUT':
      try {
        if (id) {
          const oldData = await Schema.findById(id)
          console.log('Schema', Schema.collection.collectionName)
          console.log('typeof', typeof Schema.collection.collectionName)
          if (!oldData) {
            return res?.status(400).json({ success: false })
          }

          // Если это пользователь обновляет профиль, то после обновления оповестим о результате через телеграм
          const afterUpdateNeedToNotificate =
            // body.userId === id &&
            Schema === Users && !isUserQuestionnaireFilled(oldData)

          data = await Schema.findByIdAndUpdate(id, body.data, {
            new: true,
            runValidators: true,
          })

          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (Schema === Events) {
            const calendarEvent = updateEventInCalendar(data)
          }

          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'updete',
            data,
            userId: body.userId,
          })

          if (afterUpdateNeedToNotificate) {
            const users = await Users.find({})
            const usersTelegramIds = users
              .filter(
                (user) =>
                  isUserAdmin(user) &&
                  user.notifications?.get('telegram').active &&
                  user.notifications?.get('telegram')?.id
              )
              .map((user) => user.notifications?.get('telegram')?.id)
            await Promise.all(
              usersTelegramIds.map(async (telegramId) => {
                const fullUserName = getUserFullName(data)
                await postData(
                  `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
                  {
                    chat_id: telegramId,
                    text: `Пользователь с номером +${
                      data.phone
                    } заполнил анкету:\n - Полное имя: ${fullUserName}\n - Пол: ${
                      data.gender === 'male' ? 'Мужчина' : 'Женщина'
                    }\n - Дата рождения: ${birthDateToAge(
                      data.birthday,
                      new Date(),
                      true,
                      true,
                      true
                    )}`,
                    parse_mode: 'html',
                    reply_markup:
                      req.headers.origin.substr(0, 5) === 'https'
                        ? JSON.stringify({
                            inline_keyboard: [
                              [
                                {
                                  text: '\u{1F464} Пользователь',
                                  url: req.headers.origin + '/user/' + id,
                                },
                              ],
                            ].filter((botton) => botton),
                          })
                        : undefined,
                  },
                  (data) => console.log('data', data),
                  (data) => console.log('error', data),
                  true,
                  null,
                  true
                )
                if (data.images && data.images[0]) {
                  await postData(
                    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMediaGroup`,
                    {
                      chat_id: telegramId,
                      media: JSON.stringify(
                        data.images.map((photo) => {
                          return {
                            type: 'photo',
                            media: photo,
                            // caption: 'Наденька',
                            // "parse_mode": "optional (you can delete this parameter) the parse mode of the caption"
                          }
                        })
                      ),
                      // reply_markup:
                      //   req.headers.origin.substr(0, 5) === 'https'
                      //     ? JSON.stringify({
                      //         inline_keyboard: [
                      //           [
                      //             {
                      //               text: 'Открыть пользователя',
                      //               url: req.headers.origin + '/user/' + eventId,
                      //             },
                      //           ],
                      //         ],
                      //       })
                      //     : undefined,
                    },
                    (data) => console.log('data', data),
                    (data) => console.log('error', data),
                    true,
                    null,
                    true
                  )
                  // await postData(
                  //   `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendPhoto`,
                  //   {
                  //     chat_id: telegramId,
                  //     photo: data.images[0],
                  //     caption: fullUserName,
                  //     // reply_markup:
                  //     //   req.headers.origin.substr(0, 5) === 'https'
                  //     //     ? JSON.stringify({
                  //     //         inline_keyboard: [
                  //     //           [
                  //     //             {
                  //     //               text: 'Открыть пользователя',
                  //     //               url: req.headers.origin + '/user/' + eventId,
                  //     //             },
                  //     //           ],
                  //     //         ],
                  //     //       })
                  //     //     : undefined,
                  //   },
                  //   (data) => console.log('data', data),
                  //   (data) => console.log('error', data),
                  //   true
                  // )
                }
              })
            )
          }

          return res?.status(200).json({ success: true, data })
        } else {
          return res?.status(400).json({ success: false, error: 'No Id' })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false })
      }
      break
    case 'DELETE':
      try {
        if (params) {
          data = await Schema.deleteMany(params)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'delete',
            data,
            userId: body.userId,
          })
          return res?.status(200).json({ success: true, data })
        } else if (id) {
          const existingData = await Schema.findById(id)
          if (!existingData) {
            return res?.status(400).json({ success: false })
          }
          data = await Schema.deleteOne({
            _id: id,
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (Schema === Events) {
            deleteEventFromCalendar(existingData.googleCalendarId)
          }

          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'delete',
            data,
            userId: body.userId,
          })
          return res?.status(200).json({ success: true, data })
        } else if (body?.params) {
          data = await Schema.deleteMany({
            _id: { $in: body.params },
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'delete',
            data,
            userId: body.userId,
          })
          return res?.status(200).json({ success: true, data })
        } else {
          return res?.status(400).json({ success: false })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    default:
      return res?.status(400).json({ success: false })
      break
  }
}
