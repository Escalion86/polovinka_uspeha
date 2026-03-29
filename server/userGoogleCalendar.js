import DOMPurify from 'isomorphic-dompurify'
import { google } from 'googleapis'
import crypto from 'crypto'
import formatAddress from '@helpers/formatAddress'
import getTimeZoneByLocation from './getTimeZoneByLocation'

const GOOGLE_CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar']
const ACTIVE_SIGNUP_STATUSES = ['participant', 'reserve', 'assistant']

const toError = (type, message, status = 400) => ({
  success: false,
  status,
  data: { error: { type, message } },
})

const normalizeDomain = (value) => {
  const domain = String(value || '').trim().replace(/\/+$/, '')
  return domain || ''
}

const getRedirectUri = (location) => {
  const envRedirect = String(process.env.GOOGLE_OAUTH_REDIRECT_URI || '').trim()
  if (envRedirect) {
    return envRedirect.includes('{location}')
      ? envRedirect.replaceAll('{location}', location)
      : envRedirect
  }

  const domain = normalizeDomain(process.env.DOMAIN)
  if (!domain) return ''
  return `${domain}/api/${location}/google-calendar/callback`
}

const getOauthConfig = (location) => {
  const clientId = String(process.env.GOOGLE_OAUTH_CLIENT_ID || '').trim()
  const clientSecret = String(process.env.GOOGLE_OAUTH_CLIENT_SECRET || '').trim()
  const redirectUri = getRedirectUri(location)

  if (!clientId || !clientSecret || !redirectUri) return null

  return { clientId, clientSecret, redirectUri }
}

const createOAuthClient = (location) => {
  const config = getOauthConfig(location)
  if (!config) return null

  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUri
  )
}

const createCalendarClient = (oauth2Client) =>
  google.calendar({
    version: 'v3',
    auth: oauth2Client,
  })

const linkAReformer = (link) => {
  const textLink = link.substring(link.indexOf('>') + 1, link.lastIndexOf('<'))
  const text = link.substring(link.indexOf(`href="`) + 6).split('"')[0]
  return text === textLink || textLink === 'about:blank' || !textLink
    ? text
    : `${textLink} (${text})`
}

const preparePlainEventDescription = (descriptionRaw = '') => {
  let preparedText = String(descriptionRaw || '')
  const aTags = preparedText.match(/<a[^>]*>([^<]+)<\/a>/g)
  if (aTags?.length > 0) {
    for (let i = 0; i < aTags.length; i++) {
      preparedText = preparedText.replaceAll(aTags[i], linkAReformer(aTags[i]))
    }
  }

  return DOMPurify.sanitize(
    preparedText
      .replaceAll('<p><br></p>', '\n')
      .replaceAll('</blockquote>', '\n</blockquote>')
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
  )
}

const buildCalendarEventResource = ({ event, eventUser, location }) => {
  const subEvent = Array.isArray(event?.subEvents)
    ? event.subEvents.find(({ id }) => id === eventUser?.subEventId)
    : null
  const hasMultipleSubEvents =
    Array.isArray(event?.subEvents) && event.subEvents.length > 1
  const isReserve = eventUser?.status === 'reserve'
  const isAssistant = eventUser?.status === 'assistant'
  const reserveText = isReserve
    ? 'Вы записаны в резерв на это мероприятие.'
    : isAssistant
      ? 'Вы отмечены как ведущий этого мероприятия.'
      : 'Ваша запись подтверждена.'
  const subEventText =
    hasMultipleSubEvents && subEvent?.title
      ? `\nФормат участия: ${subEvent.title}`
      : ''

  const summaryPrefix = isAssistant
    ? '[ВЕДУЩИЙ] '
    : isReserve
      ? '[РЕЗЕРВ] '
      : ''

  const description = [
    preparePlainEventDescription(event?.description),
    '',
    reserveText + subEventText,
    '',
    `Ссылка на мероприятие:\n${process.env.DOMAIN}/${location}/event/${event?._id}`,
  ]
    .filter((line) => line !== null && typeof line !== 'undefined')
    .join('\n')
    .trim()

  return {
    summary: `${summaryPrefix}${event?.title || 'Мероприятие'}`,
    description,
    start: {
      dateTime: event?.dateStart,
      timeZone: getTimeZoneByLocation(location),
    },
    end: {
      dateTime: event?.dateEnd,
      timeZone: getTimeZoneByLocation(location),
    },
    location: formatAddress(event?.address),
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  }
}

const shouldSyncStatus = (status) => ACTIVE_SIGNUP_STATUSES.includes(status)

const pickPublicIntegration = (integration) => ({
  connected: Boolean(integration?.connected),
  calendarId: integration?.calendarId ?? null,
  calendarSummary: integration?.calendarSummary ?? null,
  email: integration?.email ?? null,
})

const getIntegrationByUserId = async (db, userId) => {
  if (!db || !userId) return null
  return await db.model('UsersGoogleCalendars').findOne({ userId }).lean()
}

const updateIntegrationByUserId = async (db, userId, patch = {}) => {
  if (!db || !userId) return null
  return await db
    .model('UsersGoogleCalendars')
    .findOneAndUpdate(
      { userId },
      patch,
      { returnDocument: 'after', upsert: true }
    )
    .lean()
}

const createAuthedClientFromIntegration = (integration, location) => {
  const oauth2Client = createOAuthClient(location)
  if (!oauth2Client) return null

  oauth2Client.setCredentials({
    access_token: integration?.tokens?.accessToken || undefined,
    refresh_token: integration?.tokens?.refreshToken || undefined,
    expiry_date: integration?.tokens?.expiryDate || undefined,
    scope: integration?.tokens?.scope || undefined,
    token_type: integration?.tokens?.tokenType || undefined,
  })

  return oauth2Client
}

const deleteCalendarEventIfExists = async ({
  eventId,
  calendarId,
  integration,
  location,
}) => {
  if (!eventId || !calendarId || !integration) return

  try {
    const oauth2Client = createAuthedClientFromIntegration(integration, location)
    if (!oauth2Client) return

    const calendar = createCalendarClient(oauth2Client)
    await calendar.events.delete({
      calendarId,
      eventId,
    })
  } catch (error) {
    const code = Number(error?.code || error?.response?.status || 0)
    if (code !== 404) {
      console.log('deleteCalendarEventIfExists error:', error)
    }
  }
}

export const beginGoogleCalendarAuth = async ({ db, location, userId }) => {
  const oauth2Client = createOAuthClient(location)
  if (!oauth2Client) {
    return toError(
      'google_calendar_not_configured',
      'Google OAuth не настроен в ENV',
      500
    )
  }

  const state = crypto.randomBytes(24).toString('hex')
  await updateIntegrationByUserId(db, userId, {
    $set: {
      oauthState: state,
    },
  })

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    scope: GOOGLE_CALENDAR_SCOPES,
    state,
  })

  return {
    success: true,
    data: { authUrl },
  }
}

export const completeGoogleCalendarAuth = async ({
  db,
  location,
  userId,
  code,
  state,
}) => {
  const integration = await getIntegrationByUserId(db, userId)
  if (!integration?.oauthState || integration.oauthState !== state) {
    return toError(
      'google_calendar_invalid_state',
      'Неверный state OAuth авторизации',
      400
    )
  }

  const oauth2Client = createOAuthClient(location)
  if (!oauth2Client) {
    return toError(
      'google_calendar_not_configured',
      'Google OAuth не настроен в ENV',
      500
    )
  }

  const { tokens } = await oauth2Client.getToken(code)
  if (!tokens) {
    return toError(
      'google_calendar_token_exchange_failed',
      'Не удалось получить токены Google',
      400
    )
  }

  const mergedRefreshToken =
    tokens.refresh_token || integration?.tokens?.refreshToken || null

  await updateIntegrationByUserId(db, userId, {
    $set: {
      connected: true,
      oauthState: null,
      tokens: {
        accessToken: tokens.access_token || null,
        refreshToken: mergedRefreshToken,
        expiryDate: tokens.expiry_date || null,
        scope: tokens.scope || null,
        tokenType: tokens.token_type || null,
      },
    },
  })

  return { success: true, data: { connected: true } }
}

export const getGoogleCalendarSettings = async ({ db, location, userId }) => {
  const integration = await getIntegrationByUserId(db, userId)
  if (!integration?.connected || !integration?.tokens?.refreshToken) {
    return {
      success: true,
      data: {
        ...pickPublicIntegration(integration),
        calendars: [],
      },
    }
  }

  try {
    const oauth2Client = createAuthedClientFromIntegration(integration, location)
    if (!oauth2Client) {
      return toError(
        'google_calendar_not_configured',
        'Google OAuth не настроен в ENV',
        500
      )
    }

    const calendar = createCalendarClient(oauth2Client)
    const result = await calendar.calendarList.list({
      minAccessRole: 'writer',
      showDeleted: false,
      showHidden: false,
    })

    const calendars = Array.isArray(result?.data?.items)
      ? result.data.items.map((item) => ({
          id: item.id,
          summary: item.summary || item.id,
          primary: Boolean(item.primary),
        }))
      : []

    return {
      success: true,
      data: {
        ...pickPublicIntegration(integration),
        calendars,
      },
    }
  } catch (error) {
    console.log('getGoogleCalendarSettings error:', error)
    return toError(
      'google_calendar_read_failed',
      'Не удалось получить список календарей Google',
      400
    )
  }
}

export const selectGoogleCalendar = async ({
  db,
  location,
  userId,
  calendarId,
  calendarSummary,
}) => {
  if (!calendarId) {
    return toError(
      'google_calendar_id_required',
      'Не выбран календарь Google',
      400
    )
  }

  const integration = await updateIntegrationByUserId(db, userId, {
    $set: {
      connected: true,
      calendarId,
      calendarSummary: calendarSummary || null,
    },
  })

  const signedEventUsers = await db
    .model('EventsUsers')
    .find({
      userId,
      status: { $in: ACTIVE_SIGNUP_STATUSES },
    })
    .lean()

  if (signedEventUsers.length > 0) {
    // Не блокируем ответ API длительной синхронизацией исторических записей.
    setTimeout(() => {
      syncEventUsersGoogleCalendar({
        db,
        location,
        eventUsers: signedEventUsers,
      }).catch((error) => {
        console.log('background syncEventUsersGoogleCalendar error:', error)
      })
    }, 0)
  }

  return {
    success: true,
    data: pickPublicIntegration(integration),
  }
}

export const disconnectGoogleCalendar = async ({ db, location, userId }) => {
  const integration = await getIntegrationByUserId(db, userId)
  if (!integration) {
    return { success: true, data: { disconnected: true } }
  }

  const signedEventUsers = await db
    .model('EventsUsers')
    .find({
      userId,
      googleCalendarUserEventId: { $ne: null },
    })
    .select({
      _id: 1,
      googleCalendarUserEventId: 1,
      googleCalendarUserCalendarId: 1,
      userId: 1,
      eventId: 1,
      status: 1,
      subEventId: 1,
    })
    .lean()

  // Сначала мгновенно отключаем интеграцию и очищаем локальные привязки,
  // чтобы UI не зависел от времени ответа Google API.
  await db.model('UsersGoogleCalendars').findOneAndUpdate(
    { userId },
    {
      $set: {
        connected: false,
        calendarId: null,
        calendarSummary: null,
        email: null,
        tokens: null,
        oauthState: null,
      },
    },
    { returnDocument: 'after', upsert: true }
  )

  await db.model('EventsUsers').updateMany(
    { userId },
    {
      $set: {
        googleCalendarUserEventId: null,
        googleCalendarUserCalendarId: null,
        googleCalendarSyncedAt: null,
      },
    }
  )

  if (signedEventUsers.length > 0) {
    setTimeout(() => {
      Promise.allSettled(
        signedEventUsers.map((eventUser) =>
          deleteCalendarEventIfExists({
            eventId: eventUser.googleCalendarUserEventId,
            calendarId:
              eventUser.googleCalendarUserCalendarId ||
              integration?.calendarId ||
              null,
            integration,
            location,
          })
        )
      ).catch((error) => {
        console.log('background disconnect google calendar cleanup error:', error)
      })
    }, 0)
  }

  return { success: true, data: { disconnected: true } }
}

const syncOneEventUserGoogleCalendar = async ({
  db,
  location,
  eventUser,
  integration,
  forceDelete = false,
}) => {
  if (!eventUser?.userId) return

  const existingGoogleEventId = eventUser?.googleCalendarUserEventId || null
  const existingGoogleCalendarId = eventUser?.googleCalendarUserCalendarId || null

  if (forceDelete || !shouldSyncStatus(eventUser?.status)) {
    await deleteCalendarEventIfExists({
      eventId: existingGoogleEventId,
      calendarId: existingGoogleCalendarId || integration?.calendarId || null,
      integration,
      location,
    })

    if (eventUser?._id && !forceDelete) {
      await db.model('EventsUsers').findByIdAndUpdate(eventUser._id, {
        $set: {
          googleCalendarUserEventId: null,
          googleCalendarUserCalendarId: null,
          googleCalendarSyncedAt: null,
        },
      })
    }
    return
  }

  if (
    !integration?.connected ||
    !integration?.calendarId ||
    !integration?.tokens?.refreshToken
  ) {
    return
  }

  const event = await db.model('Events').findById(eventUser.eventId).lean()
  if (!event?._id) return

  const oauth2Client = createAuthedClientFromIntegration(integration, location)
  if (!oauth2Client) return

  const calendar = createCalendarClient(oauth2Client)
  const resource = buildCalendarEventResource({ event, eventUser, location })
  const selectedCalendarId = integration.calendarId

  let googleEventId = existingGoogleEventId
  let googleCalendarId = existingGoogleCalendarId

  if (
    googleEventId &&
    googleCalendarId &&
    googleCalendarId !== selectedCalendarId
  ) {
    await deleteCalendarEventIfExists({
      eventId: googleEventId,
      calendarId: googleCalendarId,
      integration,
      location,
    })
    googleEventId = null
    googleCalendarId = null
  }

  if (googleEventId) {
    await calendar.events.update({
      calendarId: selectedCalendarId,
      eventId: googleEventId,
      resource,
    })
  } else {
    const created = await calendar.events.insert({
      calendarId: selectedCalendarId,
      resource,
    })
    googleEventId = created?.data?.id || null
    googleCalendarId = selectedCalendarId
  }

  if (!eventUser?._id) return

  await db.model('EventsUsers').findByIdAndUpdate(eventUser._id, {
    $set: {
      googleCalendarUserEventId: googleEventId,
      googleCalendarUserCalendarId: googleCalendarId,
      googleCalendarSyncedAt: new Date(),
    },
  })
}

export const syncEventUsersGoogleCalendar = async ({
  db,
  location,
  eventUsers = [],
  forceDelete = false,
}) => {
  if (!Array.isArray(eventUsers) || eventUsers.length === 0) return

  const usersIds = Array.from(
    new Set(eventUsers.map((item) => item?.userId).filter(Boolean))
  )

  if (usersIds.length === 0) return

  const integrations = await db
    .model('UsersGoogleCalendars')
    .find({ userId: { $in: usersIds } })
    .lean()

  const integrationMap = new Map()
  integrations.forEach((item) => {
    integrationMap.set(String(item.userId), item)
  })

  for (const eventUser of eventUsers) {
    const integration = integrationMap.get(String(eventUser.userId)) || null
    try {
      await syncOneEventUserGoogleCalendar({
        db,
        location,
        eventUser,
        integration,
        forceDelete,
      })
    } catch (error) {
      console.log('syncEventUsersGoogleCalendar error:', {
        eventUserId: eventUser?._id,
        userId: eventUser?.userId,
        eventId: eventUser?.eventId,
        error,
      })
    }
  }
}
