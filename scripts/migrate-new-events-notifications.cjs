const fs = require('fs')
const path = require('path')
const { MongoClient } = require('mongodb')
const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

const LOCATIONS = ['krsk', 'nrsk', 'ekb']
const DB_ENV_MAP = {
  krsk: 'MONGODB_KRSK_DBNAME',
  nrsk: 'MONGODB_NRSK_DBNAME',
  ekb: 'MONGODB_EKB_DBNAME',
}

const DB_SUFFIX = process.env.MIGRATE_NEW_EVENTS_DB_SUFFIX || ''
const WRITE_MODE = process.argv.includes('--write')

const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj || {}, key)

const normalizeRoleNotifications = (roleDoc) => {
  const notifications =
    roleDoc && typeof roleDoc.notifications === 'object'
      ? { ...roleDoc.notifications }
      : {}

  const hasLegacyKey = hasOwn(notifications, 'newEventsByTags')
  const hasNewKey = hasOwn(notifications, 'newEvents')

  if (!hasLegacyKey && !hasNewKey) {
    return { changed: false, notifications }
  }

  if (!hasNewKey && typeof notifications.newEventsByTags === 'boolean') {
    notifications.newEvents = notifications.newEventsByTags
  }

  delete notifications.newEventsByTags

  return { changed: true, notifications }
}

const normalizeUserNotifications = (userDoc) => {
  const notifications =
    userDoc && typeof userDoc.notifications === 'object'
      ? { ...userDoc.notifications }
      : {}
  const settings =
    notifications && typeof notifications.settings === 'object'
      ? { ...notifications.settings }
      : {}

  const hasLegacyKey = hasOwn(settings, 'newEventsByTags')
  const hasNewKey = hasOwn(settings, 'newEvents')

  if (!hasLegacyKey && !hasNewKey) {
    return { changed: false, notifications }
  }

  if (!hasNewKey && typeof settings.newEventsByTags === 'boolean') {
    settings.newEvents = settings.newEventsByTags
  }

  delete settings.newEventsByTags
  notifications.settings = settings

  return { changed: true, notifications }
}

async function processRoles(db, location, changedExamples) {
  const roles = await db
    .collection('roles')
    .find({}, { projection: { _id: 1, notifications: 1, name: 1 } })
    .toArray()

  let wouldUpdate = 0
  let updated = 0

  for (const role of roles) {
    const before = role?.notifications || {}
    const normalized = normalizeRoleNotifications(role)
    if (!normalized.changed) continue

    const after = normalized.notifications
    wouldUpdate += 1

    if (changedExamples.length < 100) {
      changedExamples.push({
        type: 'role',
        location,
        id: String(role._id),
        name: role?.name ?? null,
        before,
        after,
      })
    }

    if (WRITE_MODE) {
      await db.collection('roles').updateOne(
        { _id: role._id },
        {
          $set: { notifications: after },
        }
      )
      updated += 1
    }
  }

  return {
    read: roles.length,
    wouldUpdate,
    updated,
  }
}

async function processUsers(db, location, changedExamples) {
  const users = await db
    .collection('users')
    .find({}, { projection: { _id: 1, notifications: 1, phone: 1, role: 1 } })
    .toArray()

  let wouldUpdate = 0
  let updated = 0

  for (const user of users) {
    const before = user?.notifications || {}
    const normalized = normalizeUserNotifications(user)
    if (!normalized.changed) continue

    const after = normalized.notifications
    wouldUpdate += 1

    if (changedExamples.length < 100) {
      changedExamples.push({
        type: 'user',
        location,
        id: String(user._id),
        phone: user?.phone ?? null,
        role: user?.role ?? null,
        before,
        after,
      })
    }

    if (WRITE_MODE) {
      await db.collection('users').updateOne(
        { _id: user._id },
        {
          $set: { notifications: after },
        }
      )
      updated += 1
    }
  }

  return {
    read: users.length,
    wouldUpdate,
    updated,
  }
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is required')

  const missingDbVars = LOCATIONS.filter(
    (location) => !process.env[DB_ENV_MAP[location]]
  )
  if (missingDbVars.length > 0) {
    throw new Error(
      `Missing db names: ${missingDbVars
        .map((location) => DB_ENV_MAP[location])
        .join(', ')}`
    )
  }

  const startedAt = new Date().toISOString()
  const client = new MongoClient(uri)
  const changedExamples = []
  const perLocation = {}
  const totals = {
    rolesRead: 0,
    rolesWouldUpdate: 0,
    rolesUpdated: 0,
    usersRead: 0,
    usersWouldUpdate: 0,
    usersUpdated: 0,
  }

  try {
    await client.connect()

    for (const location of LOCATIONS) {
      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const db = client.db(dbName)

      const rolesStats = await processRoles(db, location, changedExamples)
      const usersStats = await processUsers(db, location, changedExamples)

      totals.rolesRead += rolesStats.read
      totals.rolesWouldUpdate += rolesStats.wouldUpdate
      totals.rolesUpdated += rolesStats.updated
      totals.usersRead += usersStats.read
      totals.usersWouldUpdate += usersStats.wouldUpdate
      totals.usersUpdated += usersStats.updated

      perLocation[location] = {
        dbName,
        roles: rolesStats,
        users: usersStats,
      }
    }

    const finishedAt = new Date().toISOString()
    const report = {
      mode: WRITE_MODE ? 'write' : 'dry-run',
      startedAt,
      finishedAt,
      env: {
        dbSuffix: DB_SUFFIX || null,
      },
      summary: {
        ...totals,
        totalWouldUpdate: totals.rolesWouldUpdate + totals.usersWouldUpdate,
        totalUpdated: totals.rolesUpdated + totals.usersUpdated,
      },
      perLocation,
      changedExamples,
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(
      reportsDir,
      `migrate-new-events-notifications-${stamp}.json`
    )
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

    console.log(
      JSON.stringify(
        {
          success: true,
          reportPath,
          summary: report.summary,
          perLocation,
        },
        null,
        2
      )
    )
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
