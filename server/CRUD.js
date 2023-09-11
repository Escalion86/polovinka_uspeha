import birthDateToAge from '@helpers/birthDateToAge'
import { postData } from '@helpers/CRUD'
import formatAddress from '@helpers/formatAddress'
// import formatDate from '@helpers/formatDate'
import getUserFullName from '@helpers/getUserFullName'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import Events from '@models/Events'
import Histories from '@models/Histories'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import sanitize from 'sanitize-html'
import sendTelegramMessage from './sendTelegramMessage'
import isUserModer from '@helpers/isUserModer'

const linkAReformer = (link) => {
  const textLink = link.substring(link.indexOf('>') + 1, link.lastIndexOf('<'))
  const text = link.substring(link.indexOf(`href="`) + 6).split('"')[0]
  return text === textLink || textLink === 'about:blank' || !textLink
    ? text
    : `${textLink} (${text})`
}

const { google } = require('googleapis')
const SCOPES = ['https://www.googleapis.com/auth/calendar']
const {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PROJECT_NUMBER,
  GOOGLE_CALENDAR_ID,
} = process.env

const connectToGoogleCalendar = () => {
  if (
    !GOOGLE_CLIENT_EMAIL ||
    !GOOGLE_PRIVATE_KEY ||
    !SCOPES ||
    !GOOGLE_PROJECT_NUMBER
  )
    return undefined

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
  if (!calendar) return undefined

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

  return calendarEventData?.data?.id
}

const deleteEventFromCalendar = async (googleCalendarId) => {
  if (!googleCalendarId) return

  const calendar = connectToGoogleCalendar()
  if (!calendar) return undefined

  const auth = new google.auth.GoogleAuth({
    keyFile: './google_calendar_token.json',
    scopes: SCOPES,
  })

  const authProcess = await auth.getClient()

  const calendarEventData = await new Promise((resolve, reject) => {
    calendar.events.delete(
      {
        auth: authProcess,
        calendarId: GOOGLE_CALENDAR_ID,
        eventId: googleCalendarId,
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

  return calendarEventData
}

const updateEventInCalendar = async (event, req) => {
  const calendar = connectToGoogleCalendar()
  if (!calendar) return undefined

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
  var preparedText = event.description
  const aTags = event.description.match(/<a[^>]*>([^<]+)<\/a>/g)
  const linksReformated = []
  if (aTags?.length > 0) {
    for (let i = 0; i < aTags.length; i++)
      preparedText = preparedText.replaceAll(aTags[i], linkAReformer(aTags[i]))
  }

  const calendarEvent = {
    summary: `${event.showOnSite ? '' : '[СКРЫТО] '}${
      event.status === 'canceled' ? '[ОТМЕНЕНО] ' : ''
    }${event.title}`,
    description:
      sanitize(
        preparedText
          .replaceAll('<p><br></p>', '\n')
          .replaceAll('</blockquote>', '\n</blockquote>')
          // .replaceAll('<ul>', '\n<ul>')
          // .replaceAll('<ol>', '\n<ol>')
          .replaceAll('<li>', '\u{2764} <li>')
          .replaceAll('</li>', '\n</li>')
          .replaceAll('</p>', '\n</p>')
          .replaceAll('<br>', '\n'),
        {
          allowedTags: [],
          allowedAttributes: {},
        }
      ) +
      `\n\nСсылка на мероприятие:\n${
        req.headers.origin + '/event/' + event._id
      }`,
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
    const createdCalendarEvent = await new Promise((resolve, reject) => {
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
              // console.log(result)
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

    await dbConnect()
    const updatedEvent = await Events.findByIdAndUpdate(
      event._id,
      { googleCalendarId: createdCalendarEvent.data.id },
      {
        new: true,
        runValidators: true,
      }
    )

    return createdCalendarEvent
  }

  console.log('Обновляем событие в календаре')
  const updatedCalendarEvent = await new Promise((resolve, reject) => {
    calendar.events.update(
      {
        auth: authProcess,
        calendarId: GOOGLE_CALENDAR_ID,
        eventId: event.googleCalendarId ?? undefined,
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

  return updatedCalendarEvent
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
            clearedBody.googleCalendarId = calendarEventId
          }

          data = await Schema.create(clearedBody)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          if (Schema === Events) {
            // console.log('data :>> ', data)
            const calendarEvent = await updateEventInCalendar(data, req)
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
          if (!oldData) {
            return res?.status(400).json({ success: false })
          }

          data = await Schema.findByIdAndUpdate(id, body.data, {
            new: true,
            runValidators: true,
          })

          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (Schema === Events) {
            const calendarEvent = await updateEventInCalendar(data, req)
          }

          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'updete',
            data,
            userId: body.userId,
          })

          // Если это пользователь обновляет профиль, то после обновления оповестим о результате через телеграм
          if (Schema === Users && !isUserQuestionnaireFilled(oldData)) {
            const users = await Users.find({})
            const usersTelegramIds = users
              .filter(
                (user) =>
                  isUserModer(user) &&
                  user.notifications?.get('settings')?.newUserRegistred &&
                  user.notifications?.get('telegram').active &&
                  user.notifications?.get('telegram')?.id
              )
              .map((user) => user.notifications?.get('telegram')?.id)

            const text = `Пользователь с номером +${
              data.phone
            } заполнил анкету:\n - Полное имя: ${getUserFullName(
              data
            )}\n - Пол: ${
              data.gender === 'male' ? 'Мужчина' : 'Женщина'
            }\n - Дата рождения: ${birthDateToAge(
              data.birthday,
              new Date(),
              true,
              true,
              true
            )}`

            await sendTelegramMessage({
              req,
              telegramIds: usersTelegramIds,
              text,
              images: data.images,
              inline_keyboard: [
                [
                  {
                    text: '\u{1F464} Пользователь',
                    url: req.headers.origin + '/user/' + id,
                  },
                ],
              ],
            })
            // await Promise.all(
            //   usersTelegramIds.map(async (telegramId) => {
            //     await postData(
            //       `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
            //       {
            //         chat_id: telegramId,
            //         text: `Пользователь с номером +${
            //           data.phone
            //         } заполнил анкету:\n - Полное имя: ${fullUserName}\n - Пол: ${
            //           data.gender === 'male' ? 'Мужчина' : 'Женщина'
            //         }\n - Дата рождения: ${birthDateToAge(
            //           data.birthday,
            //           new Date(),
            //           true,
            //           true,
            //           true
            //         )}`,
            //         parse_mode: 'html',
            //         reply_markup:
            //           req.headers.origin.substr(0, 5) === 'https'
            //             ? JSON.stringify({
            //                 inline_keyboard: [
            //                   [
            //                     {
            //                       text: '\u{1F464} Пользователь',
            //                       url: req.headers.origin + '/user/' + id,
            //                     },
            //                   ],
            //                 ].filter((botton) => botton),
            //               })
            //             : undefined,
            //       },
            //       (data) => console.log('data', data),
            //       (data) => console.log('error', data),
            //       true,
            //       null,
            //       true
            //     )
            //     if (data.images && data.images[0]) {
            //       await postData(
            //         `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMediaGroup`,
            //         {
            //           chat_id: telegramId,
            //           media: JSON.stringify(
            //             data.images.map((photo) => {
            //               return {
            //                 type: 'photo',
            //                 media: photo,
            //               }
            //             })
            //           ),
            //         },
            //         (data) => console.log('data', data),
            //         (data) => console.log('error', data),
            //         true,
            //         null,
            //         true
            //       )
            //     }
            //   })
            // )
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
