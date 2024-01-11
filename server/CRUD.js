import birthDateToAge from '@helpers/birthDateToAge'
import formatAddress from '@helpers/formatAddress'
import formatEventDateTime from '@helpers/formatEventDateTime'
import getUserFullName from '@helpers/getUserFullName'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import Events from '@models/Events'
import Histories from '@models/Histories'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import DOMPurify from 'isomorphic-dompurify'
import sendTelegramMessage from './sendTelegramMessage'
import { DEFAULT_ROLES } from '@helpers/constants'
import Roles from '@models/Roles'
import mongoose from 'mongoose'

// const test_callback = {
//   update_id: 173172137,
//   callback_query: {
//     id: '1121425242543370968',
//     from: {
//       id: 261102161,
//       is_bot: false,
//       first_name: 'Алексей',
//       last_name: 'Белинский Иллюзионист',
//       username: 'Escalion',
//       language_code: 'ru',
//       is_premium: true,
//     },
//     message: {
//       message_id: 91,
//       from: '[Object]',
//       chat: ' [Object]',
//       date: 1683689196,
//       text: 'Неизвестная команда',
//       reply_markup: '[Object]',
//     },
//     chat_instance: '3955131192076482535',
//     data: '/createTeam',
//   },
// }
// const rtest = {
//   body: {
//     update_id: 173172081,
//     message: {
//       message_id: 14,
//       from: {
//         id: 261102161,
//         is_bot: false,
//         first_name: 'Алексей',
//         last_name: 'Белинский Иллюзионист',
//         username: 'Escalion',
//         language_code: 'ru',
//         is_premium: true,
//       },
//       chat: {
//         id: 261102161,
//         first_name: 'Алексей',
//         last_name: 'Белинский Иллюзионист',
//         username: 'Escalion',
//         type: 'private',
//       },
//       date: 1683645745,
//       text: '/new_team',
//       entities: [{ offset: 0, length: 12, type: 'bot_command' }],
//     },
//   },
// }

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
  // const linksReformated = []
  if (aTags?.length > 0) {
    for (let i = 0; i < aTags.length; i++)
      preparedText = preparedText.replaceAll(aTags[i], linkAReformer(aTags[i]))
  }

  const calendarEvent = {
    summary: `${event.showOnSite ? '' : '[СКРЫТО] '}${
      event.status === 'canceled' ? '[ОТМЕНЕНО] ' : ''
    }${event.title}`,
    description:
      DOMPurify.sanitize(
        preparedText
          .replaceAll('<p><br></p>', '\n')
          .replaceAll('</blockquote>', '\n</blockquote>')
          // .replaceAll('<ul>', '\n<ul>')
          // .replaceAll('<ol>', '\n<ol>')
          .replaceAll('<li>', '\u{2764} <li>')
          .replaceAll('</li>', '\n</li>')
          .replaceAll('</p>', '\n</p>')
          .replaceAll('<br>', '\n')
          .replaceAll('&nbsp;', ' ')
          .trim('\n'),
        {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
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

const notificateUsersAboutEvent = async (event, req) => {
  await dbConnect()
  const rolesSettings = await Roles.find({})
  const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
  const rolesIdsToNewEventsByTagsNotification = allRoles
    .filter((role) => role?.notifications?.newEventsByTags)
    .map((role) => role._id)

  const users = await Users.find({
    role:
      process.env.NODE_ENV === 'development'
        ? 'dev'
        : { $in: rolesIdsToNewEventsByTagsNotification },
    'notifications.settings.newEventsByTags': true,
    'notifications.telegram.active': true,
    'notifications.telegram.id': {
      $exists: true,
      $ne: null,
    },
  })

  const usersToNotificate = users.filter((user) => {
    const userAge = new Number(
      birthDateToAge(user.birthday, undefined, false, false)
    )

    const isUserTooOld =
      userAge &&
      ((user.gender === 'male' &&
        typeof event.maxMansAge === 'number' &&
        event.maxMansAge < userAge) ||
        (user.gender === 'famale' &&
          typeof event.maxWomansAge === 'number' &&
          event.maxWomansAge < userAge))
    if (isUserTooOld) return false

    // const isUserTooYoung =
    //   userAge &&
    //   ((user.gender === 'male' &&
    //     typeof event.maxMansAge === 'number' &&
    //     event.minMansAge > userAge) ||
    //     (user.gender === 'famale' &&
    //       typeof event.maxWomansAge === 'number' &&
    //       event.minWomansAge > userAge))
    // if (isUserTooYoung) return false

    // const isUserStatusCorrect = user.status
    //   ? event.usersStatusAccess[user.status]
    //   : event.usersStatusAccess['novice']
    // if (!isUserStatusCorrect) return false
    // const isUserRelationshipCorrect =
    //   !event.usersRelationshipAccess ||
    //   event.usersRelationshipAccess === 'yes' ||
    //   (user.relationship
    //     ? event.usersRelationshipAccess === 'only'
    //     : event.usersRelationshipAccess === 'no')
    // if (!isUserRelationshipCorrect) return false

    return (
      !user.eventsTagsNotification ||
      user.eventsTagsNotification?.length === 0 ||
      user.eventsTagsNotification.find((tag) => event.tags.includes(tag))
    )
  })

  const novicesTelegramIds = usersToNotificate
    .filter((user) => user.status === 'novice' || !user.status)
    .map((user) => user.notifications?.get('telegram')?.id)

  const membersTelegramIds = usersToNotificate
    .filter((user) => user.status === 'member')
    .map((user) => user.notifications?.get('telegram')?.id)

  const eventPrice = event.price / 100
  const eventPriceForMember =
    (event.price -
      (event.usersStatusDiscount
        ? event.usersStatusDiscount?.get('member')
        : 0)) /
    100
  const eventPriceForNovice =
    (event.price -
      (event.usersStatusDiscount
        ? event.usersStatusDiscount?.get('novice')
        : 0)) /
    100

  const address = event.address
    ? `\n\n\u{1F4CD} <b>Место проведения</b>:\n${formatAddress(
        JSON.parse(JSON.stringify(event.address))
      )}`
    : ''

  const textStart = `\u{1F4C5} ${formatEventDateTime(event, {
    fullWeek: true,
    weekInBrackets: true,
  }).toUpperCase()}\n<b>${event.title}</b>\n${DOMPurify.sanitize(
    event.description
      .replaceAll('<p><br></p>', '\n')
      .replaceAll('<blockquote>', '\n<blockquote>')
      .replaceAll('<li>', '\n\u{2764} <li>')
      .replaceAll('<p>', '\n<p>')
      .replaceAll('<br>', '\n')
      .replaceAll('&nbsp;', ' ')
      .trim('\n'),
    {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }
  )}${address}`

  const textPriceForNovice = `\n\u{1F4B0} <b>Стоимость</b>: ${
    eventPriceForNovice !== eventPrice
      ? `<s>${eventPrice}</s>   <b>${eventPriceForNovice}</b>`
      : eventPriceForNovice
  } руб`

  const textPriceForMember = `\n\u{1F4B0} <b>Стоимость</b>: ${
    eventPriceForMember !== eventPrice
      ? `<s>${eventPrice}</s>   <b>${eventPriceForMember}</b>`
      : eventPriceForMember
  } руб`

  const eventTags =
    typeof event.tags === 'object' && event.tags?.length > 0
      ? event.tags.filter((tag) => tag)
      : []
  const textEnd = eventTags.length > 0 ? `\n\n#${eventTags.join(' #')}` : ''

  const inline_keyboard = [
    [
      {
        text: '\u{1F4C5} На сайте',
        url: req.headers.origin + '/event/' + String(event._id),
      },
      {
        text: '\u{1F4DD} Записаться',
        callback_data: JSON.stringify({ c: 'eventSignIn', eventId: event._id }),
      },
    ],
  ]
  if (novicesTelegramIds.length > 0) {
    sendTelegramMessage({
      req,
      telegramIds: novicesTelegramIds,
      text: textStart + textPriceForNovice + textEnd,
      inline_keyboard,
    })
  }
  if (membersTelegramIds.length > 0) {
    sendTelegramMessage({
      req,
      telegramIds: membersTelegramIds,
      text: textStart + textPriceForMember + textEnd,
      inline_keyboard,
    })
  }
}

export default async function handler(Schema, req, res, params = null) {
  const { query, method, body } = req

  const id = query?.id

  await dbConnect()

  let data
  console.log('CRUD', { Schema, method, params, id, body, query })

  switch (method) {
    case 'GET':
      try {
        if (id) {
          data = await Schema.findById(id).select({ password: 0 })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (Object.keys(query).length > 0) {
          if (query['data._id'])
            query['data._id'] = mongoose.Types.ObjectId(query['data._id'])
          data = await Schema.find(query).select({ password: 0 })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (params) {
          data = await Schema.find(params).select({ password: 0 })
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

          // Создаем пустой календарь и получаем его id
          if (Schema === Events) {
            clearedBody.googleCalendarId = await addBlankEventToCalendar()
          }

          data = await Schema.create(clearedBody)
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (Schema === Events) {
            // Вносим данные в календарь так как теперь мы имеем id мероприятия
            const calendarEvent = updateEventInCalendar(data, req)

            // Проверяем есть ли тэги у мероприятия и видимо ли оно => оповещаем пользователей по их интересам
            if (data.showOnSite && data.tags && typeof data.tags === 'object') {
              notificateUsersAboutEvent(data, req)
            }
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
            const calendarEvent = updateEventInCalendar(data, req)
            if (
              !oldData.showOnSite &&
              data.showOnSite &&
              data.tags &&
              typeof data.tags === 'object'
            ) {
              notificateUsersAboutEvent(data, req)
            }
          }

          await Histories.create({
            schema: Schema.collection.collectionName,
            action: 'update',
            data,
            userId: body.userId,
          })

          // Если это пользователь обновляет профиль, то после обновления оповестим о результате через телеграм
          if (Schema === Users) {
            // Если Telegram ID был обновлен
            const oldTelegramId = oldData.notifications?.get('telegram')?.id
            const newTelegramId = data.notifications?.get('telegram')?.id
            const oldTelegramActivate =
              oldData.notifications?.get('telegram')?.active
            const newTelegramActivate =
              data.notifications?.get('telegram')?.active

            if (
              oldTelegramId !== newTelegramId ||
              oldTelegramActivate !== newTelegramActivate
            ) {
              // Если ID есть и переключили на active или обновили ID
              if (newTelegramId && newTelegramActivate) {
                sendTelegramMessage({
                  req,
                  telegramIds: newTelegramId,
                  text: '\u{2705} Уведомления подключены!',
                })
              }
              // Если выключили уведомления
              if (
                oldTelegramActivate &&
                !newTelegramActivate &&
                newTelegramId
              ) {
                sendTelegramMessage({
                  req,
                  telegramIds: newTelegramId,
                  text: '\u{26D4} Уведомления отключены!',
                })
              }
              // Если ID удален
              if (oldTelegramId && !newTelegramId) {
                sendTelegramMessage({
                  req,
                  telegramIds: oldTelegramId,
                  text: '\u{26D4} Уведомления отключены!',
                })
              }
            }
            if (!isUserQuestionnaireFilled(oldData)) {
              // const users = await Users.find({})
              const rolesSettings = await Roles.find({})
              const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
              const rolesIdsToNewUserRegistredNotification = allRoles
                .filter((role) => role?.notifications?.newUserRegistred)
                .map((role) => role._id)

              const usersWithTelegramNotificationsOfEventUsersON =
                await Users.find({
                  role:
                    process.env.NODE_ENV === 'development'
                      ? 'dev'
                      : { $in: rolesIdsToNewUserRegistredNotification },
                  'notifications.settings.newUserRegistred': true,
                  'notifications.telegram.active': true,
                  'notifications.telegram.id': {
                    $exists: true,
                    $ne: null,
                  },
                })
              const usersTelegramIds =
                usersWithTelegramNotificationsOfEventUsersON.map(
                  (user) => user.notifications?.get('telegram')?.id
                )

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

              sendTelegramMessage({
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
