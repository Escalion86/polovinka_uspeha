import mongoose from 'mongoose'

import {
  buildUserAchievementsPayload,
  isEventClosedForAchievements,
  PARTICIPANT_EXCLUDED_STATUSES,
} from './recalculateEventAchievements'

const buildUserEventsMap = (eventLinks, eventsMap, now) => {
  const userEvents = new Map()

  eventLinks.forEach(({ userId, eventId }) => {
    const normalizedUserId = String(userId ?? '')
    if (!normalizedUserId) return
    const event = eventsMap.get(String(eventId))
    if (!event) return
    if (!isEventClosedForAchievements(event, now)) return

    if (!userEvents.has(normalizedUserId)) {
      userEvents.set(normalizedUserId, [])
    }

    userEvents.get(normalizedUserId).push(event)
  })

  return userEvents
}

const executeBulkUpdates = async (model, operations) => {
  if (!operations.length) return 0
  const bulkResult = await model.bulkWrite(operations, { ordered: false })
  return bulkResult?.modifiedCount ?? 0
}

const recalculateAllEventAchievements = async (db) => {
  if (!db) return { processedUsers: 0, updatedUsers: 0 }

  const eventsUsersModel = db.model('EventsUsers')
  const eventsUsers = await eventsUsersModel
    .find({ status: { $nin: PARTICIPANT_EXCLUDED_STATUSES } })
    .select({ userId: 1, eventId: 1 })
    .lean()

  const eventIds = [
    ...new Set(
      eventsUsers
        .map(({ eventId }) => eventId)
        .filter((eventId) => mongoose.Types.ObjectId.isValid(eventId))
    ),
  ]

  const events =
    eventIds.length > 0
      ? await db
          .model('Events')
          .find({ _id: { $in: eventIds } })
          .select({ status: 1, blank: 1, dateEnd: 1, tags: 1 })
          .lean()
      : []

  const eventsMap = new Map(events.map((event) => [String(event._id), event]))
  const now = new Date()
  const userEventsMap = buildUserEventsMap(eventsUsers, eventsMap, now)

  const users = await db.model('Users').find({}).select({ _id: 1 }).lean()
  const usersModel = db.model('Users')

  const updatedAt = new Date()
  const operations = []
  const BATCH_SIZE = 500
  let processedUsers = 0
  let updatedUsers = 0

  const flushOperations = async () => {
    if (operations.length === 0) return
    updatedUsers += await executeBulkUpdates(usersModel, operations)
    operations.length = 0
  }

  for (const user of users) {
    processedUsers += 1
    const userEvents = userEventsMap.get(String(user._id)) ?? []
    const payload = buildUserAchievementsPayload(userEvents, updatedAt)

    operations.push({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { eventAchievements: payload } },
      },
    })

    if (operations.length >= BATCH_SIZE) {
      await flushOperations()
    }
  }

  await flushOperations()

  return { processedUsers, updatedUsers }
}

export default recalculateAllEventAchievements
