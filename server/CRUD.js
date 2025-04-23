import birthDateToAge from '@helpers/birthDateToAge'
import formatAddress from '@helpers/formatAddress'
import getUserFullName from '@helpers/getUserFullName'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'

import dbConnect from '@utils/dbConnect'
import DOMPurify from 'isomorphic-dompurify'
import sendTelegramMessage from './sendTelegramMessage'
import { DEFAULT_ROLES } from '@helpers/constants'

import mongoose from 'mongoose'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
// import subEventsSummator from '@helpers/subEventsSummator'

import serviceUserTelegramNotification from './serviceUserTelegramNotification'
import getGoogleCalendarJSONByLocation from './getGoogleCalendarJSONByLocation'
import getTimeZoneByLocation from './getTimeZoneByLocation'
import getGoogleCalendarConstantsByLocation from './getGoogleCalendarConstantsByLocation'
import checkLocationValid from './checkLocationValid'
import refreshSignedUpEventsCount from './refreshSignedUpEventsCount'
// import { telegramCmdToIndex } from './telegramCmd'

function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

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
const { MODE } = process.env

const connectToGoogleCalendar = (location) => {
  const calendarConstants = getGoogleCalendarConstantsByLocation(location)
  if (!calendarConstants) return

  const { calendarId, email, privateKey, projectNumber } = calendarConstants
  const jwtClient = new google.auth.JWT(email, null, privateKey, SCOPES)
  const calendar = google.calendar({
    version: 'v3',
    project: projectNumber,
    auth: jwtClient,
  })

  return calendar
}

const addBlankEventToCalendar = async (location) => {
  const calendar = connectToGoogleCalendar(location)
  if (!calendar) return

  const calendarConstants = getGoogleCalendarConstantsByLocation(location)
  if (!calendarConstants) return

  const { calendarId, email, privateKey, projectNumber } = calendarConstants

  const timeZone = getTimeZoneByLocation(location)

  const calendarEvent = {
    summary: '[blank]',
    description: '',
    start: {
      dateTime: new Date(),
      timeZone,
    },
    end: {
      dateTime: new Date(),
      timeZone,
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

  const keyFile = getGoogleCalendarJSONByLocation(location)

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: SCOPES,
  })

  const authProcess = await auth.getClient()

  const calendarEventData = await new Promise((resolve, reject) => {
    calendar.events.insert(
      {
        auth: authProcess,
        calendarId,
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

const deleteEventFromCalendar = async (googleCalendarId, location) => {
  if (!googleCalendarId) return

  const calendar = connectToGoogleCalendar(location)
  if (!calendar) return undefined

  const calendarConstants = getGoogleCalendarConstantsByLocation(location)
  if (!calendarConstants) return

  const { calendarId, email, privateKey, projectNumber } = calendarConstants

  const keyFile = getGoogleCalendarJSONByLocation(location)

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: SCOPES,
  })

  const authProcess = await auth.getClient()

  const calendarEventData = await new Promise((resolve, reject) => {
    calendar.events.delete(
      {
        auth: authProcess,
        calendarId,
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

const updateEventInCalendar = async (event, location) => {
  const calendar = connectToGoogleCalendar(location)
  if (!calendar) return

  const calendarConstants = getGoogleCalendarConstantsByLocation(location)
  if (!calendarConstants) return

  const { calendarId, email, privateKey, projectNumber } = calendarConstants

  var preparedText = event.description
  const aTags = event.description.match(/<a[^>]*>([^<]+)<\/a>/g)
  // const linksReformated = []
  if (aTags?.length > 0) {
    for (let i = 0; i < aTags.length; i++)
      preparedText = preparedText.replaceAll(aTags[i], linkAReformer(aTags[i]))
  }

  const timeZone = getTimeZoneByLocation(location)

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
        process.env.DOMAIN + '/' + location + '/event/' + event._id
      }`,
    start: {
      dateTime: event.dateStart,
      timeZone,
    },
    end: {
      dateTime: event.dateEnd,
      timeZone,
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
    // visibility: event.showOnSite ? 'default' : 'private',
  }

  const keyFile = getGoogleCalendarJSONByLocation(location)

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: SCOPES,
  })

  const authProcess = await auth.getClient()

  // Создаем новое событие (пустое) в календаре, если нет googleCalendarId
  if (!event.googleCalendarId) {
    const createdCalendarEvent = await new Promise((resolve, reject) => {
      calendar.events.insert(
        {
          auth: authProcess,
          calendarId,
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

    const db = await dbConnect(location)
    if (!db) return

    const updatedEvent = await db
      .model('Events')
      .findByIdAndUpdate(
        event._id,
        { googleCalendarId: createdCalendarEvent.data.id },
        {
          new: true,
          runValidators: true,
        }
      )
      .lean()

    return createdCalendarEvent
  }

  if (!event?.googleCalendarId) return
  // Обновляем событие в календаре
  const updatedCalendarEvent = await new Promise((resolve, reject) => {
    calendar.events.update(
      {
        auth: authProcess,
        calendarId,
        eventId: event.googleCalendarId,
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

export default async function handler(Schema, req, res, props = {}) {
  const { params, select, autoIncrementIndex } = props
  const { query, method, body } = req

  const id = query?.id
  const location = query?.location
  const querySelect = query?.select // array

  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })
  // console.log('CRUD', { Schema, method, params, id, body, query })

  delete query.location
  delete query.select

  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })

  let data

  const selectOpts =
    !select && querySelect
      ? querySelect.split(',')
      : { ...(select ?? {}), password: 0 }

  switch (method) {
    case 'GET':
      try {
        if (id) {
          data = await db.model(Schema).findById(id).select(selectOpts)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (Object.keys(query).length > 0) {
          const preparedQuery = { ...query }
          for (const [key, value] of Object.entries(preparedQuery)) {
            if (isJson(value)) preparedQuery[key] = JSON.parse(value)
            if (value === 'true') preparedQuery[key] = true
            if (value === 'false') preparedQuery[key] = false
          }
          if (preparedQuery['data._id'])
            preparedQuery['data._id'] = new mongoose.Types.ObjectId(
              preparedQuery['data._id']
            )
          data = await db.model(Schema).find(preparedQuery).select(selectOpts)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (params) {
          data = await db.model(Schema).find(params).select(selectOpts)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else {
          data = await db.model(Schema).find().select(selectOpts)
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
          if (Schema === 'Events' && MODE === 'production') {
            clearedBody.googleCalendarId =
              await addBlankEventToCalendar(location)
          }

          if (autoIncrementIndex) {
            const itemsInModelCount = await db.model(Schema).countDocuments({})
            clearedBody.index = itemsInModelCount
          }

          data = await db.model(Schema).create(clearedBody)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          const jsonData = data.toJSON()

          if (Schema === 'Events' && MODE === 'production') {
            // Вносим данные в календарь так как теперь мы имеем id мероприятия
            const calendarEvent = updateEventInCalendar(jsonData, location)

            // Проверяем есть ли тэги у мероприятия и видимо ли оно => оповещаем пользователей по их интересам
            // if (jsonData.showOnSite) {
            //   notificateUsersAboutEvent(jsonData, req)
            // }
          }

          if (Schema === 'ServicesUsers') {
            serviceUserTelegramNotification({
              userId: jsonData.userId,
              serviceId: jsonData.serviceId,
              req,
              location,
            })
          }

          await db.model('Histories').create({
            schema: Schema.toLowerCase(),
            action: 'add',
            data: jsonData,
            userId: body.userId,
          })

          return res?.status(201).json({ success: true, data: jsonData })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    case 'PUT':
      try {
        if (id) {
          const oldData = await db.model(Schema).findById(id).lean()
          if (!oldData) {
            return res?.status(400).json({ success: false })
          }

          data = await db
            .model(Schema)
            .findByIdAndUpdate(id, body.data, {
              new: true,
              runValidators: true,
            })
            .lean()

          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (Schema === 'Events' && MODE === 'production') {
            const calendarEvent = updateEventInCalendar(data, location)
            // if (!oldData.showOnSite && data.showOnSite) {
            //   notificateUsersAboutEvent(data, req)
            // }
          }

          if (
            Schema === 'Events' &&
            (oldData.status === 'closed' || data.status === 'closed')
          ) {
            const result = await refreshSignedUpEventsCount(location, {
              eventId: id,
            })
            console.log('result :>> ', result)
          }

          const difference = compareObjectsWithDif(oldData, data)
          difference._id = new mongoose.Types.ObjectId(id)

          await db.model('Histories').create({
            schema: Schema.toLowerCase(),
            action: 'update',
            data: difference,
            userId: body.userId,
            difference: true,
          })

          // Если это пользователь обновляет профиль, то после обновления оповестим о результате через телеграм
          if (Schema === 'Users') {
            // Если Telegram ID был обновлен
            const oldTelegramId = oldData.notifications?.telegram?.id
            const newTelegramId = data.notifications?.telegram?.id
            const oldTelegramActivate = oldData.notifications?.telegram?.active
            const newTelegramActivate = data.notifications?.telegram?.active

            if (
              oldTelegramId !== newTelegramId ||
              oldTelegramActivate !== newTelegramActivate
            ) {
              // Если ID есть и переключили на active или обновили ID
              if (newTelegramId && newTelegramActivate) {
                await sendTelegramMessage({
                  telegramIds: newTelegramId,
                  text: '\u{2705} Уведомления подключены!',
                  location,
                })
              }
              // Если выключили уведомления
              if (
                oldTelegramActivate &&
                !newTelegramActivate &&
                newTelegramId
              ) {
                await sendTelegramMessage({
                  telegramIds: newTelegramId,
                  text: '\u{26D4} Уведомления отключены!',
                  location,
                })
              }
              // Если ID удален
              if (oldTelegramId && !newTelegramId) {
                await sendTelegramMessage({
                  telegramIds: oldTelegramId,
                  text: '\u{26D4} Уведомления отключены!',
                  location,
                })
              }
            }
            if (!isUserQuestionnaireFilled(oldData)) {
              // const users = await db.model('Users').find({})
              const rolesSettings = await db.model('Roles').find({}).lean()
              const allRoles = [...DEFAULT_ROLES, ...rolesSettings]
              const rolesIdsToNewUserRegistredNotification = allRoles
                .filter((role) => role?.notifications?.newUserRegistred)
                .map((role) => role._id)

              const usersWithTelegramNotificationsOfEventUsersON = await db
                .model('Users')
                .find({
                  role:
                    process.env.TELEGRAM_NOTIFICATION_DEV_ONLY === 'true'
                      ? 'dev'
                      : { $in: rolesIdsToNewUserRegistredNotification },
                  'notifications.settings.newUserRegistred': true,
                  'notifications.telegram.active': true,
                  'notifications.telegram.id': {
                    $exists: true,
                    $ne: null,
                  },
                })
                .lean()
              const usersTelegramIds =
                usersWithTelegramNotificationsOfEventUsersON.map(
                  (user) => user.notifications?.telegram?.id
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
                      url: process.env.DOMAIN + '/' + location + '/user/' + id,
                    },
                  ],
                ],
                location,
              })
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
          const existingData = await db.model(Schema).find(params)
          data = await db.model(Schema).deleteMany(params)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          await db.model('Histories').create({
            schema: Schema.toLowerCase(),
            action: 'delete',
            data: existingData,
            userId: body.userId,
          })
          return res?.status(200).json({ success: true, data })
        } else if (id) {
          const existingData = await db.model(Schema).findById(id)
          if (!existingData) {
            return res?.status(400).json({ success: false })
          }
          data = await db.model(Schema).deleteOne({
            _id: id,
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (Schema === 'Events' && MODE === 'production') {
            deleteEventFromCalendar(existingData.googleCalendarId, location)
          }

          await db.model('Histories').create({
            schema: Schema.toLowerCase(),
            action: 'delete',
            data: existingData,
            userId: body.userId,
          })
          return res?.status(200).json({ success: true, data })
        } else if (body?.params) {
          const existingData = await db.model(Schema).find({
            _id: { $in: body.params },
          })
          data = await db.model(Schema).deleteMany({
            _id: { $in: body.params },
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          await db.model('Histories').create({
            schema: Schema.toLowerCase(),
            action: 'delete',
            data: existingData,
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
