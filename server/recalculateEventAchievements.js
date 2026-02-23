import mongoose from 'mongoose'

import { EVENT_ACHIEVEMENTS_CONFIG } from '@helpers/eventAchievementsConfig'

const PARTICIPANT_EXCLUDED_STATUSES = ['reserve', 'ban']

const isEventClosedForAchievements = (event, now = new Date()) => {
  if (!event) return false

  const status = String(event.status ?? '').toLowerCase()
  if (status === 'closed' || status === 'close') return true
  if (!event.blank || !event.dateEnd) return false

  return new Date(event.dateEnd).getTime() <= now.getTime()
}

const resolveEventDate = (event) => {
  const source = event?.dateEnd || event?.dateStart
  if (!source) return null
  const date = new Date(source)
  return Number.isNaN(date.getTime()) ? null : date
}

const countUniqueDirections = (events) => {
  const directionIds = new Set()

  events.forEach((event) => {
    if (!event?.directionId) return
    directionIds.add(String(event.directionId))
  })

  return directionIds.size
}

const countActiveMonths = (events) => {
  const months = new Set()

  events.forEach((event) => {
    const date = resolveEventDate(event)
    if (!date) return
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`
    months.add(monthKey)
  })

  return months.size
}

const countWeekendVisits = (events) => {
  return events.reduce((total, event) => {
    const date = resolveEventDate(event)
    if (!date) return total
    const day = date.getDay()
    return day === 0 || day === 6 ? total + 1 : total
  }, 0)
}

const calculateAchievementMetric = (events, metric) => {
  if (!Array.isArray(events)) return 0

  if (metric === 'uniqueDirections') return countUniqueDirections(events)
  if (metric === 'activeMonths') return countActiveMonths(events)
  if (metric === 'weekendVisits') return countWeekendVisits(events)
  return events.length
}

const buildUserAchievementsPayload = (events, updatedAt) => {
  return EVENT_ACHIEVEMENTS_CONFIG.map((config) => ({
    key: config.key,
    value: calculateAchievementMetric(events, config.metric),
    updatedAt,
  }))
}

const toObjectIds = (ids) =>
  ids
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id))

const groupUserEvents = (eventLinks, eventsMap, now) => {
  const userEvents = new Map()

  eventLinks.forEach(({ userId, eventId }) => {
    const event = eventsMap.get(String(eventId))
    if (!event) return
    if (!isEventClosedForAchievements(event, now)) return

    if (!userEvents.has(userId)) {
      userEvents.set(userId, [])
    }

    userEvents.get(userId).push(event)
  })

  return userEvents
}

const recalculateEventAchievements = async ({ db, eventId }) => {
  if (!db || !eventId) return { updatedUsers: 0 }

  const participants = await db
    .model('EventsUsers')
    .find({
      eventId: String(eventId),
      status: { $nin: PARTICIPANT_EXCLUDED_STATUSES },
    })
    .select({ userId: 1 })
    .lean()

  const participantIds = [
    ...new Set(participants.map(({ userId }) => userId).filter(Boolean)),
  ]

  if (participantIds.length === 0) {
    return { updatedUsers: 0 }
  }

  const relatedEventLinks = await db
    .model('EventsUsers')
    .find({
      userId: { $in: participantIds },
      status: { $nin: PARTICIPANT_EXCLUDED_STATUSES },
    })
    .select({ userId: 1, eventId: 1 })
    .lean()

  if (relatedEventLinks.length === 0) {
    return { updatedUsers: 0 }
  }

  const eventIds = [
    ...new Set(relatedEventLinks.map(({ eventId }) => eventId).filter(Boolean)),
  ]

  const objectIds = toObjectIds(eventIds)
  if (objectIds.length === 0) {
    return { updatedUsers: 0 }
  }

  const events = await db
    .model('Events')
    .find({ _id: { $in: objectIds } })
    .select({ status: 1, blank: 1, dateStart: 1, dateEnd: 1, directionId: 1 })
    .lean()

  const eventsMap = new Map(events.map((event) => [String(event._id), event]))

  const now = new Date()
  const userEventsMap = groupUserEvents(relatedEventLinks, eventsMap, now)

  const updatedAt = new Date()

  const updatedFlags = await Promise.all(
    participantIds.map(async (userId) => {
      const eventsList = userEventsMap.get(userId) ?? []
      const payload = buildUserAchievementsPayload(eventsList, updatedAt)

      const result = await db
        .model('Users')
        .findByIdAndUpdate(
          userId,
          { $set: { eventAchievements: payload } }
        )

      return Boolean(result)
    })
  )

  const updatedUsers = updatedFlags.filter(Boolean).length

  return { updatedUsers }
}

export {
  PARTICIPANT_EXCLUDED_STATUSES,
  isEventClosedForAchievements,
  buildUserAchievementsPayload,
}

export default recalculateEventAchievements
