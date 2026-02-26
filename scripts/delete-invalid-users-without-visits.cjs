const fs = require('fs')
const path = require('path')
const { MongoClient, ObjectId } = require('mongodb')
const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

const LOCATIONS = ['krsk', 'nrsk', 'ekb']
const DB_ENV_MAP = {
  krsk: 'MONGODB_KRSK_DBNAME',
  nrsk: 'MONGODB_NRSK_DBNAME',
  ekb: 'MONGODB_EKB_DBNAME',
}

const DB_SUFFIX = process.env.DELETE_INVALID_USERS_DB_SUFFIX || ''
const WRITE_MODE = process.argv.includes('--write')

const normalizePhone = (rawValue) => {
  if (rawValue === null || rawValue === undefined) return ''

  let digits = String(rawValue).replace(/\D/g, '')
  if (!digits) return ''

  if (digits.length > 11) digits = digits.slice(-11)
  if (digits.length === 10) return `7${digits}`

  if (digits.length === 11) {
    if (digits[0] === '8') return `7${digits.slice(1)}`
    if (digits[0] === '7') return digits
    return `7${digits.slice(-10)}`
  }

  if (digits[0] === '8') return `7${digits.slice(1)}`
  if (digits[0] === '7') return digits
  return `7${digits}`
}

const isValidPhone = (phone) => /^7\d{10}$/.test(String(phone || ''))

const toCsvCell = (value) => {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

const buildFullName = (user = {}) => {
  const first = String(user.firstName || '').trim()
  const second = String(user.secondName || '').trim()
  return [first, second].filter(Boolean).join(' ').trim()
}

const isParticipantStatus = (status) =>
  String(status || '').trim().toLowerCase() === 'participant'

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

  const client = new MongoClient(uri)
  const startedAt = new Date().toISOString()

  const report = {
    mode: WRITE_MODE ? 'write' : 'dry-run',
    startedAt,
    finishedAt: null,
    env: {
      dbSuffix: DB_SUFFIX || null,
      locations: LOCATIONS,
    },
    summary: {
      totalUsersRead: 0,
      totalInvalidUsers: 0,
      deletableCandidates: 0,
      deletedUsers: 0,
    },
    perLocation: {},
    deletable: [],
    skipped: [],
  }

  try {
    await client.connect()

    for (const location of LOCATIONS) {
      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const db = client.db(dbName)

      const users = await db
        .collection('users')
        .find(
          {},
          {
            projection: {
              _id: 1,
              firstName: 1,
              secondName: 1,
              phone: 1,
              status: 1,
              role: 1,
            },
          }
        )
        .toArray()

      report.summary.totalUsersRead += users.length

      const invalidUsers = users
        .map((user) => {
          const normalizedPhone = normalizePhone(user.phone)
          return {
            ...user,
            normalizedPhone,
            validPhone: isValidPhone(normalizedPhone),
          }
        })
        .filter((user) => !user.validPhone)

      report.summary.totalInvalidUsers += invalidUsers.length

      const invalidIds = invalidUsers.map((user) => String(user._id))
      const eventsUsersRecords =
        invalidIds.length > 0
          ? await db
              .collection('eventsusers')
              .find(
                { userId: { $in: invalidIds } },
                { projection: { _id: 0, userId: 1, eventId: 1, status: 1 } }
              )
              .toArray()
          : []

      const eventObjectIds = Array.from(
        new Set(
          eventsUsersRecords
            .map((item) => String(item?.eventId || '').trim())
            .filter((id) => ObjectId.isValid(id))
        )
      ).map((id) => new ObjectId(id))

      const closedEventIds = new Set()
      if (eventObjectIds.length > 0) {
        const closedEvents = await db
          .collection('events')
          .find(
            { _id: { $in: eventObjectIds }, status: 'closed' },
            { projection: { _id: 1 } }
          )
          .toArray()
        closedEvents.forEach((eventDoc) => closedEventIds.add(String(eventDoc._id)))
      }

      const countersByUserId = new Map()
      invalidIds.forEach((id) => {
        countersByUserId.set(id, {
          eventsUsersCount: 0,
          visitedClosedCount: 0,
        })
      })

      eventsUsersRecords.forEach((entry) => {
        const userId = String(entry?.userId || '').trim()
        const counters = countersByUserId.get(userId)
        if (!counters) return

        const status = String(entry?.status || '').trim().toLowerCase()
        const eventId = String(entry?.eventId || '').trim()

        counters.eventsUsersCount += 1

        if (isParticipantStatus(status) && closedEventIds.has(eventId)) {
          counters.visitedClosedCount += 1
        }
      })

      const deletableIds = []

      invalidUsers.forEach((user) => {
        const userId = String(user._id)
        const counters = countersByUserId.get(userId) || {
          eventsUsersCount: 0,
          visitedClosedCount: 0,
        }

        const row = {
          city: location,
          dbName,
          userId,
          fullName: buildFullName(user),
          firstName: String(user.firstName || '').trim(),
          secondName: String(user.secondName || '').trim(),
          rawPhone: user.phone ?? null,
          normalizedPhone: user.normalizedPhone,
          status: user.status ?? null,
          role: user.role ?? null,
          eventsUsersCount: counters.eventsUsersCount,
          visitedClosedCount: counters.visitedClosedCount,
          canDelete:
            counters.visitedClosedCount === 0 && counters.eventsUsersCount === 0,
          reason:
            counters.eventsUsersCount > 0
              ? 'has_eventsusers_records'
              : counters.visitedClosedCount > 0
                ? 'has_closed_event_visits'
                : 'no_events_activity',
          userUrl: `/${location}/user/${userId}`,
        }

        if (row.canDelete) {
          deletableIds.push(user._id)
          report.deletable.push(row)
        } else {
          report.skipped.push(row)
        }
      })

      let deletedCount = 0
      if (WRITE_MODE && deletableIds.length > 0) {
        const deleteResult = await db
          .collection('users')
          .deleteMany({ _id: { $in: deletableIds } })
        deletedCount = Number(deleteResult?.deletedCount || 0)
      }

      report.summary.deletableCandidates += deletableIds.length
      report.summary.deletedUsers += deletedCount
      report.perLocation[location] = {
        dbName,
        usersRead: users.length,
        invalidUsers: invalidUsers.length,
        deletableCandidates: deletableIds.length,
        deletedUsers: deletedCount,
      }
    }

    report.finishedAt = new Date().toISOString()

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const jsonPath = path.join(
      reportsDir,
      `delete-invalid-users-without-visits-${stamp}.json`
    )
    const csvPath = path.join(
      reportsDir,
      `delete-invalid-users-without-visits-${stamp}.csv`
    )

    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8')

    const rows = [...report.deletable, ...report.skipped]
    const header = [
      'canDelete',
      'reason',
      'city',
      'dbName',
      'userId',
      'fullName',
      'firstName',
      'secondName',
      'rawPhone',
      'normalizedPhone',
      'status',
      'role',
      'eventsUsersCount',
      'visitedClosedCount',
      'userUrl',
    ]

    const body = rows.map((row) =>
      [
        row.canDelete,
        row.reason,
        row.city,
        row.dbName,
        row.userId,
        row.fullName,
        row.firstName,
        row.secondName,
        row.rawPhone,
        row.normalizedPhone,
        row.status,
        row.role,
        row.eventsUsersCount,
        row.visitedClosedCount,
        row.userUrl,
      ]
        .map(toCsvCell)
        .join(',')
    )

    fs.writeFileSync(
      csvPath,
      [header.map(toCsvCell).join(','), ...body].join('\n'),
      'utf8'
    )

    console.log('Delete invalid users without visits completed')
    console.log('Mode:', report.mode)
    console.log('JSON:', jsonPath)
    console.log('CSV:', csvPath)
    console.log('Summary:', JSON.stringify(report.summary, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('Delete invalid users without visits failed:', error.message)
  process.exit(1)
})

