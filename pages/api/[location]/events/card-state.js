import checkLocationValid from '@server/checkLocationValid'
import { buildEventCardState } from '@server/eventCardState'
import getTimeZoneByLocation from '@server/getTimeZoneByLocation'
import changeTimezone from '@helpers/changeTimezone'
import dbConnect from '@utils/dbConnect'

const validationError = (message) => ({
  success: false,
  data: {
    error: {
      type: 'VALIDATION_ERROR',
      message,
    },
  },
})

const methodError = (method) => ({
  success: false,
  data: {
    error: {
      type: 'METHOD_NOT_ALLOWED',
      message: `Method ${method} Not Allowed`,
    },
  },
})

const serverError = (message = 'Failed to build event card state') => ({
  success: false,
  data: {
    error: {
      type: 'SERVER_ERROR',
      message,
    },
  },
})

const USER_FIELDS =
  '_id firstName secondName phone birthday gender status relationship role'

export default async function handler(req, res) {
  const { query, method, body } = req
  const location = query?.location

  if (!location) {
    return res.status(400).json(validationError('No location'))
  }

  if (!checkLocationValid(location)) {
    return res.status(400).json(validationError('Invalid location'))
  }

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json(methodError(method))
  }

  try {
    const payload = body?.data ?? body ?? {}
    const eventIdsRaw = Array.isArray(payload?.eventIds) ? payload.eventIds : []
    const eventIds = [...new Set(eventIdsRaw.map(String).filter(Boolean))]
    const loggedUserId = payload?.loggedUserId ? String(payload.loggedUserId) : null
    const activeRoleName = payload?.activeRoleName
      ? String(payload.activeRoleName)
      : null

    if (eventIds.length === 0) {
      return res.status(200).json({ success: true, data: {} })
    }

    const db = await dbConnect(location)
    if (!db) {
      return res.status(500).json(serverError('db error'))
    }

    const [events, eventUsers] = await Promise.all([
      db.model('Events').find({ _id: { $in: eventIds } }).lean(),
      db.model('EventsUsers').find({ eventId: { $in: eventIds } }).lean(),
    ])

    const directionIds = [
      ...new Set(events.map((event) => String(event?.directionId || '')).filter(Boolean)),
    ]

    const userIdsFromEventUsers = [
      ...new Set(eventUsers.map((item) => String(item?.userId || '')).filter(Boolean)),
    ]

    if (loggedUserId && !userIdsFromEventUsers.includes(loggedUserId)) {
      userIdsFromEventUsers.push(loggedUserId)
    }

    const [directions, users] = await Promise.all([
      directionIds.length > 0
        ? db.model('Directions').find({ _id: { $in: directionIds } }).lean()
        : [],
      userIdsFromEventUsers.length > 0
        ? db
            .model('Users')
            .find({ _id: { $in: userIdsFromEventUsers } })
            .select(USER_FIELDS)
            .lean()
        : [],
    ])

    const directionsById = new Map(
      directions.map((direction) => [String(direction._id), direction])
    )
    const usersById = new Map(users.map((user) => [String(user._id), user]))
    const loggedUser = loggedUserId ? usersById.get(loggedUserId) || null : null
    const eventUsersByEventId = eventUsers.reduce((acc, item) => {
      const currentEventId = String(item?.eventId || '')
      if (!currentEventId) return acc
      if (!acc.has(currentEventId)) acc.set(currentEventId, [])
      acc.get(currentEventId).push(item)
      return acc
    }, new Map())

    const data = {}
    const timeZone = getTimeZoneByLocation(location)
    const serverDate = timeZone
      ? changeTimezone(new Date(), timeZone)
      : new Date()

    for (const eventId of eventIds) {
      const event = events.find((item) => String(item?._id || '') === eventId)
      if (!event) {
        data[eventId] = null
        continue
      }

      const direction = directionsById.get(String(event?.directionId || ''))
      data[eventId] = buildEventCardState({
        event,
        eventUsers: eventUsersByEventId.get(eventId) || [],
        usersById,
        loggedUser,
        directionRules: direction?.rules || null,
        activeRoleName,
        serverDate,
      })
    }

    return res.status(200).json({ success: true, data })
  } catch (error) {
    console.error('Failed to build event card state', error)
    return res.status(500).json(serverError())
  }
}
