import birthDateToAge from '@helpers/birthDateToAge'
import formatAddress from '@helpers/formatAddress'
import getUserFullName from '@helpers/getUserFullName'
import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'

import dbConnect from '@utils/dbConnect'
import DOMPurify from 'isomorphic-dompurify'
import sendTelegramMessage from './sendTelegramMessage'
import { DEFAULT_ROLES } from '@helpers/constantsServer'
import { hashPassword } from '@helpers/passwordUtils'

import mongoose from 'mongoose'
import compareObjectsWithDif from '@helpers/compareObjectsWithDif'
// import subEventsSummator from '@helpers/subEventsSummator'
import fs from 'fs'

import serviceUserTelegramNotification from './serviceUserTelegramNotification'
import getGoogleCalendarJSONByLocation from './getGoogleCalendarJSONByLocation'
import getTimeZoneByLocation from './getTimeZoneByLocation'
import getGoogleCalendarConstantsByLocation from './getGoogleCalendarConstantsByLocation'
import checkLocationValid from './checkLocationValid'
import assertCityOperationAllowed from './assertCityOperationAllowed'
import refreshSignedUpEventsCount from './refreshSignedUpEventsCount'
import recalculateEventAchievements from './recalculateEventAchievements'
// import { telegramCmdToIndex } from './telegramCmd'
import processReferralRewards from './processReferralRewards'
import syncGlobalUserLink from './syncGlobalUserLink'
import { syncEventUsersGoogleCalendar } from './userGoogleCalendar'

function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const normalizeUserNotificationsSettings = (data) => {
  if (!data || typeof data !== 'object') return data
  if (!data.notifications || typeof data.notifications !== 'object') return data

  const notifications = { ...data.notifications }
  const settingsSource = notifications.settings
  if (!settingsSource || typeof settingsSource !== 'object') {
    return { ...data, notifications }
  }

  const settings = { ...settingsSource }
  if (
    typeof settings.newEvents !== 'boolean' &&
    typeof settings.newEventsByTags === 'boolean'
  ) {
    settings.newEvents = settings.newEventsByTags
  }
  delete settings.newEventsByTags

  notifications.settings = settings
  return { ...data, notifications }
}

const normalizeRoleNotificationsSettings = (data) => {
  if (!data || typeof data !== 'object') return data
  if (!data.notifications || typeof data.notifications !== 'object') return data

  const notifications = { ...data.notifications }
  if (
    typeof notifications.newEvents !== 'boolean' &&
    typeof notifications.newEventsByTags === 'boolean'
  ) {
    notifications.newEvents = notifications.newEventsByTags
  }
  delete notifications.newEventsByTags

  return { ...data, notifications }
}

const normalizeLegacyNotificationKeys = (schema, data) => {
  if (schema === 'Users') return normalizeUserNotificationsSettings(data)
  if (schema === 'Roles') return normalizeRoleNotificationsSettings(data)
  return data
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
const ACTIVE_EVENT_USER_STATUSES = ['participant', 'reserve', 'assistant']

const connectToGoogleCalendar = (location) => {
  const calendarConstants = getGoogleCalendarConstantsByLocation(location)
  if (!calendarConstants) return null

  const { projectNumber } = calendarConstants
  const calendar = google.calendar({
    version: 'v3',
    project: projectNumber,
  })

  return calendar
}

const getGoogleCalendarAuthClient = async (location) => {
  try {
    const calendarConstants = getGoogleCalendarConstantsByLocation(location)
    const emailRaw = calendarConstants?.email
    const privateKeyRaw = calendarConstants?.privateKey
    const email =
      typeof emailRaw === 'string' ? emailRaw.trim() : emailRaw || null
    const privateKey =
      typeof privateKeyRaw === 'string'
        ? privateKeyRaw.replace(/\\n/g, '\n')
        : privateKeyRaw
    const keyFile = getGoogleCalendarJSONByLocation(location)

    console.log('getGoogleCalendarAuthClient sources:', {
      location,
      cwd: process.cwd(),
      hasEnvEmail: Boolean(email),
      hasEnvPrivateKey: Boolean(privateKey),
      keyFile: keyFile || null,
      keyFileExists: Boolean(keyFile && fs.existsSync(keyFile)),
    })

    if (email && privateKey) {
      const jwtClient = new google.auth.JWT(email, null, privateKey, SCOPES)
      await jwtClient.authorize()
      console.log('getGoogleCalendarAuthClient auth via env jwt: success', {
        location,
      })
      return jwtClient
    }

    if (!keyFile || !fs.existsSync(keyFile)) return null

    const keyFileRaw = fs.readFileSync(keyFile, 'utf8')
    const keyFileJson = JSON.parse(keyFileRaw)
    const keyFileEmail =
      typeof keyFileJson?.client_email === 'string'
        ? keyFileJson.client_email.trim()
        : null
    const keyFilePrivateKeyRaw = keyFileJson?.private_key
    const keyFilePrivateKey =
      typeof keyFilePrivateKeyRaw === 'string'
        ? keyFilePrivateKeyRaw.replace(/\\n/g, '\n')
        : null

    if (!keyFileEmail || !keyFilePrivateKey) {
      console.log('getGoogleCalendarAuthClient key file missing fields:', {
        location,
        keyFile,
        hasClientEmail: Boolean(keyFileEmail),
        hasPrivateKey: Boolean(keyFilePrivateKey),
      })
      return null
    }

    const jwtClient = new google.auth.JWT(
      keyFileEmail,
      null,
      keyFilePrivateKey,
      SCOPES
    )
    await jwtClient.authorize()
    console.log('getGoogleCalendarAuthClient auth via file jwt: success', {
      location,
      keyFile,
    })
    return jwtClient
  } catch (error) {
    console.log('getGoogleCalendarAuthClient error:', {
      location,
      message: error?.message || String(error),
      code: error?.code || error?.response?.status || null,
    })
    return null
  }
}

const addBlankEventToCalendar = async (location) => {
  try {
    const calendar = connectToGoogleCalendar(location)
    if (!calendar) return

    const calendarConstants = getGoogleCalendarConstantsByLocation(location)
    if (!calendarConstants) return

    const { calendarId } = calendarConstants
    if (!calendarId) return

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

    const authProcess = await getGoogleCalendarAuthClient(location)
    if (!authProcess) return

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
          } else if (result) {
            resolve(result)
          } else {
            reject('Что-то пошло не так')
          }
        }
      )
    })

    return calendarEventData?.data?.id
  } catch (error) {
    console.log('addBlankEventToCalendar skipped:', error?.message || error)
    return undefined
  }
}

const deleteEventFromCalendar = async (googleCalendarId, location) => {
  if (!googleCalendarId) return

  const calendar = connectToGoogleCalendar(location)
  if (!calendar) return undefined

  const calendarConstants = getGoogleCalendarConstantsByLocation(location)
  if (!calendarConstants) return

  const { calendarId, email, privateKey, projectNumber } = calendarConstants

  const authProcess = await getGoogleCalendarAuthClient(location)
  if (!authProcess) return

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
  console.log('updateEventInCalendar :>> ')
  const calendar = connectToGoogleCalendar(location)
  if (!calendar) return
  console.log('1')

  const calendarConstants = getGoogleCalendarConstantsByLocation(location)
  if (!calendarConstants) return

  console.log('2')

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

  console.log('3')

  const authProcess = await getGoogleCalendarAuthClient(location)
  if (!authProcess) return

  console.log('4')

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
  console.log('5')

  if (!event?.googleCalendarId) return

  console.log('6')
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

function transformQuery(query) {
  const tryParseJSON = (value) => {
    if (typeof value !== 'string') return value
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  const processSingleValue = (key, value) => {
    if (!key) return value

    const lowercasedKey = key.toLowerCase()

    // Обработка ObjectId
    if (lowercasedKey === '_id') {
      if (typeof value !== 'string') {
        throw new Error(
          `Invalid ObjectId: expected string, got ${typeof value}`
        )
      }
      try {
        return new mongoose.Types.ObjectId(value)
      } catch (e) {
        throw new Error(`Invalid ObjectId: ${value}`)
      }
    }

    // Обработка дат (только для строковых значений)
    if (
      (lowercasedKey === 'createdat' ||
        lowercasedKey === 'updatedat' ||
        lowercasedKey.includes('date')) &&
      typeof value === 'string'
    ) {
      const date = new Date(value)
      if (isNaN(date.getTime())) throw new Error(`Invalid Date: ${value}`)
      return date
    }

    // Обработка boolean
    if (value === 'true') return true
    if (value === 'false') return false

    return value
  }

  const buildNestedStructure = (keys, rawValue, ctx) => {
    const value =
      typeof rawValue === 'string' ? tryParseJSON(rawValue) : rawValue

    const [currentKey, ...restKeys] = keys

    if (restKeys.length === 0) {
      if (currentKey === '$in' && !Array.isArray(ctx[currentKey])) {
        ctx[currentKey] = []
      }

      if (typeof value === 'object' && value !== null) {
        ctx[currentKey] = transformQuery(value)
      } else {
        if (Array.isArray(ctx[currentKey])) {
          ctx[currentKey].push(value)
        } else {
          ctx[currentKey] = value
        }
      }
      return
    }

    if (!ctx[currentKey]) {
      ctx[currentKey] = !isNaN(restKeys[0]) ? [] : {}
    }

    buildNestedStructure(restKeys, value, ctx[currentKey])
  }

  const result = {}

  // Основной цикл обработки
  for (const [rawKey, rawValue] of Object.entries(query)) {
    const parsedValue = tryParseJSON(rawValue)
    const keys = rawKey.split(/\[|\]/g).filter((k) => k !== '')
    const values = Array.isArray(parsedValue) ? parsedValue : [parsedValue]

    for (const val of values) {
      buildNestedStructure(keys, val, result)
    }
  }

  // Рекурсивная постобработка
  const recursiveProcess = (obj, parentKey = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = parentKey ? `${parentKey}.${key}` : key

      if (typeof value === 'object' && value !== null) {
        recursiveProcess(value, fullPath)
      } else {
        obj[key] = processSingleValue(fullPath, value)
      }
    }
  }

  recursiveProcess(result)

  return result
}

export default async function handler(Schema, req, res, props = {}) {
  const { params, select, autoIncrementIndex } = props
  const { query, method, body } = req

  const id = query?.id
  const location = query?.location
  const querySelect = query?.select // array
  const querySort = query?.sort
  const queryLimit = query?.limit
  const queryAggregate = query?.aggregate
    ? JSON.parse(query?.aggregate)
    : undefined
  const isCountReturn = !!query?.countReturn

  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })
  // console.log('CRUD', { Schema, method, params, id, body, query })

  delete query.location
  delete query.select
  delete query.sort
  delete query.limit
  delete query.countReturn
  delete query.aggregate

  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })

  let data

  const queryStringForm = (queryString) => {
    const query = queryString.split(',')
    if (query.includes('_id')) return query
    else {
      query.push('-_id')
      return query
    }
  }

  const selectOpts =
    !select && querySelect
      ? queryStringForm(querySelect)
      : { ...(select ?? {}), password: 0 }

  const lowercasedSchema = Schema.toLowerCase()
  const cityManagementRestrictedSchemas = new Set([
    'Events',
    'Users',
    'Services',
    'Products',
    'Payments',
  ])

  switch (method) {
    case 'GET':
      try {
        if (id) {
          data = await db.model(Schema).findById(id).select(selectOpts)
          if (data === null || typeof data === 'undefined') {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (Object.keys(query).length > 0) {
          const preparedQuery = transformQuery(query)
          // console.log('preparedQuery :>> ', preparedQuery)
          for (const [key, value] of Object.entries(preparedQuery)) {
            if (isJson(value)) preparedQuery[key] = JSON.parse(value)
            // if (value === 'true') preparedQuery[key] = true
            // if (value === 'false') preparedQuery[key] = false
          }
          if (preparedQuery['data._id'])
            preparedQuery['data._id'] = new mongoose.Types.ObjectId(
              preparedQuery['data._id']
            )
          // console.log('querySort :>> ', querySort)
          data = isCountReturn
            ? (await db.model(Schema).find(preparedQuery).select({ _id: 1 }))
                .length
            : queryAggregate
              ? await db.model(Schema).aggregate(queryAggregate)
              : await db
                  .model(Schema)
                  .find(preparedQuery)
                  .select(selectOpts)
                  .limit(queryLimit)
                  .sort(querySort)
          if (data === null || typeof data === 'undefined') {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else if (params) {
          data = isCountReturn
            ? (await db.model(Schema).find(params).select({ _id: 1 })).length
            : queryAggregate
              ? await db.model(Schema).aggregate(queryAggregate)
              : await db
                  .model(Schema)
                  .find(params)
                  // .select({ _id: 1 })
                  .limit(queryLimit)
                  .sort(querySort)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          return res?.status(200).json({ success: true, data })
        } else {
          data = isCountReturn
            ? (await db.model(Schema).find().select({ _id: 1 })).length
            : queryAggregate
              ? await db.model(Schema).aggregate(queryAggregate)
              : await db
                  .model(Schema)
                  .find()
                  .select(selectOpts)
                  .limit(queryLimit)
                  .sort(querySort)
          return res?.status(200).json({ success: true, data })
        }
      } catch (error) {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      }
      break
    case 'POST':
      try {
        if (cityManagementRestrictedSchemas.has(Schema)) {
          const eventManagementGuard = await assertCityOperationAllowed(
            location,
            'event_management'
          )
          if (!eventManagementGuard.success) {
            return res?.status(403).json(eventManagementGuard)
          }
        }

        if (id) {
          return res
            ?.status(400)
            .json({ success: false, error: 'No need to set Id' })
        } else {
          let clearedBody = { ...body.data }
          delete clearedBody._id
          clearedBody = normalizeLegacyNotificationKeys(Schema, clearedBody)

          if (
            Schema === 'Users' &&
            typeof clearedBody.password === 'string' &&
            clearedBody.password
          ) {
            clearedBody.password = await hashPassword(clearedBody.password)
          }

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

          if (Schema === 'Users') {
            try {
              const syncResult = await syncGlobalUserLink({
                location,
                user: jsonData,
                source: 'users-create',
              })
              if (!syncResult?.success) {
                console.log(
                  'syncGlobalUserLink on user create skipped:',
                  syncResult?.data?.error
                )
              }
            } catch (syncError) {
              console.log('syncGlobalUserLink on user create error:', syncError)
            }
          }

          if (Schema === 'Events' && MODE === 'production') {
            // Вносим данные в календарь так как теперь мы имеем id мероприятия
            await updateEventInCalendar(jsonData, location)

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

          if (Schema === 'EventsUsers') {
            await syncEventUsersGoogleCalendar({
              db,
              location,
              eventUsers: [jsonData],
            })
          }

          await db.model('Histories').create({
            schema: lowercasedSchema,
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
        if (cityManagementRestrictedSchemas.has(Schema)) {
          const eventManagementGuard = await assertCityOperationAllowed(
            location,
            'event_management'
          )
          if (!eventManagementGuard.success) {
            return res?.status(403).json(eventManagementGuard)
          }
        }

        if (id) {
          const oldData = await db.model(Schema).findById(id).lean()
          if (!oldData) {
            return res?.status(400).json({ success: false })
          }

          let updateData = { ...body.data }
          updateData = normalizeLegacyNotificationKeys(Schema, updateData)

          if (
            Schema === 'Users' &&
            typeof updateData.password === 'string' &&
            updateData.password
          ) {
            updateData.password = await hashPassword(updateData.password)
          }

          data = await db
            .model(Schema)
            .findByIdAndUpdate(id, updateData, {
              new: true,
              runValidators: true,
            })
            .lean()

          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (Schema === 'Events' && MODE === 'production') {
            if (data.status === 'canceled') {
              if (oldData.status !== 'canceled') {
                try {
                  await deleteEventFromCalendar(
                    oldData.googleCalendarId,
                    location
                  )
                } catch (calendarDeleteError) {
                  const calendarDeleteErrorCode = Number(
                    calendarDeleteError?.code ||
                      calendarDeleteError?.response?.status ||
                      0
                  )
                  if (calendarDeleteErrorCode !== 404) {
                    console.log(
                      'deleteEventFromCalendar on event cancel error:',
                      calendarDeleteError
                    )
                  }
                }

                if (oldData.googleCalendarId) {
                  data = await db
                    .model('Events')
                    .findByIdAndUpdate(
                      id,
                      { googleCalendarId: null },
                      {
                        returnDocument: 'after',
                        runValidators: true,
                      }
                    )
                    .lean()
                }
              }
            } else {
              await updateEventInCalendar(data, location)
            }
            // if (!oldData.showOnSite && data.showOnSite) {
            //   notificateUsersAboutEvent(data, req)
            // }
          }

          const isCanceledNow = data.status === 'canceled'
          const wasCanceledBefore = oldData.status === 'canceled'
          const cancellationStateChanged = isCanceledNow !== wasCanceledBefore

          if (Schema === 'Events' && cancellationStateChanged) {
            const eventUsers = await db
              .model('EventsUsers')
              .find({
                eventId: id,
                $or: [
                  { status: { $in: ACTIVE_EVENT_USER_STATUSES } },
                  { googleCalendarUserEventId: { $ne: null } },
                ],
              })
              .select({
                _id: 1,
                userId: 1,
                eventId: 1,
                status: 1,
                subEventId: 1,
                googleCalendarUserEventId: 1,
                googleCalendarUserCalendarId: 1,
                googleCalendarSyncedAt: 1,
              })
              .lean()

            if (eventUsers.length > 0) {
              await syncEventUsersGoogleCalendar({
                db,
                location,
                eventUsers: isCanceledNow
                  ? eventUsers.map((eventUser) => ({
                      ...eventUser,
                      status: 'canceled',
                    }))
                  : eventUsers,
              })
            }
          }

          if (
            Schema === 'Events' &&
            oldData.status !== 'closed' &&
            data.status === 'closed'
          ) {
            try {
              await processReferralRewards({ db, event: data })
            } catch (rewardError) {
              console.log('processReferralRewards error :>> ', rewardError)
            }
            try {
              await recalculateEventAchievements({ db, eventId: id })
            } catch (achievementsError) {
              console.log(
                'recalculateEventAchievements error :>> ',
                achievementsError
              )
            }
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
            schema: lowercasedSchema,
            action: 'update',
            data: difference,
            userId: body.userId,
            difference: true,
          })

          // Если это пользователь обновляет профиль, то после обновления оповестим о результате через телеграм
          if (Schema === 'Users') {
            try {
              const syncResult = await syncGlobalUserLink({
                location,
                user: data,
                source: 'users-update',
              })
              if (!syncResult?.success) {
                console.log(
                  'syncGlobalUserLink on user update skipped:',
                  syncResult?.data?.error
                )
              }
            } catch (syncError) {
              console.log('syncGlobalUserLink on user update error:', syncError)
            }

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

              const usersWithNotificationsOfEventUsersON = await db
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
              const usersTelegramIds = usersWithNotificationsOfEventUsersON
                .filter((user) => user.notifications?.telegram?.active)
                .map((user) => user.notifications?.telegram?.id)

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

              if (usersTelegramIds.filter(Boolean).length > 0) {
                sendTelegramMessage({
                  req,
                  telegramIds: usersTelegramIds,
                  text,
                  images: data.images,
                  inline_keyboard: [
                    [
                      {
                        text: '\u{1F464} Пользователь',
                        url:
                          process.env.DOMAIN + '/' + location + '/user/' + id,
                      },
                    ],
                  ],
                  location,
                })
              }
            }
          }

          if (Schema === 'EventsUsers') {
            await syncEventUsersGoogleCalendar({
              db,
              location,
              eventUsers: [data],
            })
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
        if (cityManagementRestrictedSchemas.has(Schema)) {
          const eventManagementGuard = await assertCityOperationAllowed(
            location,
            'event_management'
          )
          if (!eventManagementGuard.success) {
            return res?.status(403).json(eventManagementGuard)
          }
        }

        if (params) {
          const existingData = await db.model(Schema).find(params)
          if (
            Schema === 'EventsUsers' &&
            Array.isArray(existingData) &&
            existingData.length > 0
          ) {
            await syncEventUsersGoogleCalendar({
              db,
              location,
              eventUsers: existingData.map((item) =>
                typeof item?.toJSON === 'function' ? item.toJSON() : item
              ),
              forceDelete: true,
            })
          }
          data = await db.model(Schema).deleteMany(params)
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          await db.model('Histories').create({
            schema: lowercasedSchema,
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
          if (Schema === 'EventsUsers') {
            await syncEventUsersGoogleCalendar({
              db,
              location,
              eventUsers: [
                typeof existingData?.toJSON === 'function'
                  ? existingData.toJSON()
                  : existingData,
              ],
              forceDelete: true,
            })
          }
          data = await db.model(Schema).deleteOne({
            _id: id,
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }

          if (Schema === 'Events' && MODE === 'production') {
            await deleteEventFromCalendar(
              existingData.googleCalendarId,
              location
            )
          }

          await db.model('Histories').create({
            schema: lowercasedSchema,
            action: 'delete',
            data: existingData,
            userId: body.userId,
          })
          return res?.status(200).json({ success: true, data })
        } else if (body?.params) {
          const existingData = await db.model(Schema).find({
            _id: { $in: body.params },
          })
          if (
            Schema === 'EventsUsers' &&
            Array.isArray(existingData) &&
            existingData.length > 0
          ) {
            await syncEventUsersGoogleCalendar({
              db,
              location,
              eventUsers: existingData.map((item) =>
                typeof item?.toJSON === 'function' ? item.toJSON() : item
              ),
              forceDelete: true,
            })
          }
          data = await db.model(Schema).deleteMany({
            _id: { $in: body.params },
          })
          if (!data) {
            return res?.status(400).json({ success: false })
          }
          await db.model('Histories').create({
            schema: lowercasedSchema,
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
