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

const DB_SUFFIX = process.env.REPORT_INVALID_PHONES_DB_SUFFIX || ''

const toCsvCell = (value) => {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}

const getArgValue = (name) => {
  const idx = process.argv.findIndex((arg) => arg === name)
  if (idx < 0) return null
  return process.argv[idx + 1] || null
}

const resolveReportPath = () => {
  const explicitPath = getArgValue('--report')
  if (explicitPath) {
    const abs = path.isAbsolute(explicitPath)
      ? explicitPath
      : path.join(process.cwd(), explicitPath)
    if (!fs.existsSync(abs)) {
      throw new Error(`Report file not found: ${abs}`)
    }
    return abs
  }

  const reportsDir = path.join(process.cwd(), 'docs', 'reports')
  if (!fs.existsSync(reportsDir)) {
    throw new Error('docs/reports directory not found')
  }

  const candidates = fs
    .readdirSync(reportsDir)
    .filter((name) => /^global-users-dry-run-.*\.json$/i.test(name))
    .map((name) => ({
      name,
      fullPath: path.join(reportsDir, name),
      mtimeMs: fs.statSync(path.join(reportsDir, name)).mtimeMs,
    }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)

  if (candidates.length === 0) {
    throw new Error('No global-users-dry-run report found in docs/reports')
  }

  return candidates[0].fullPath
}

const isSignedStatus = (status) =>
  ['participant', 'reserve'].includes(String(status || '').trim().toLowerCase())

const isParticipantStatus = (status) =>
  String(status || '').trim().toLowerCase() === 'participant'

const buildFullName = (record = {}) => {
  const first = String(record.firstName || '').trim()
  const second = String(record.secondName || '').trim()
  const parts = [first, second].filter(Boolean)
  return parts.join(' ').trim()
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

  const sourceReportPath = resolveReportPath()
  const sourceReport = JSON.parse(fs.readFileSync(sourceReportPath, 'utf8'))
  const invalidPhonesSource = Array.isArray(sourceReport?.invalidPhones)
    ? sourceReport.invalidPhones
    : []

  const invalidByLocation = LOCATIONS.reduce((acc, location) => {
    acc[location] = []
    return acc
  }, {})

  invalidPhonesSource.forEach((item) => {
    const location = String(item?.city || '').trim().toLowerCase()
    if (!LOCATIONS.includes(location)) return
    const userId = String(item?.userId || '').trim()
    if (!userId) return
    invalidByLocation[location].push({
      location,
      userId,
      firstName: item?.firstName || '',
      secondName: item?.secondName || '',
      rawPhone: item?.rawPhone ?? null,
      normalizedPhone: item?.normalizedPhone ?? null,
      status: item?.status ?? null,
      role: item?.role ?? null,
    })
  })

  const rows = []
  const client = new MongoClient(uri)

  try {
    await client.connect()

    for (const location of LOCATIONS) {
      const items = invalidByLocation[location]
      if (!Array.isArray(items) || items.length === 0) continue

      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const db = client.db(dbName)

      const uniqueByUserId = new Map()
      items.forEach((item) => uniqueByUserId.set(item.userId, item))
      const userIds = Array.from(uniqueByUserId.keys())

      const eventsUsersRecords = await db
        .collection('eventsusers')
        .find(
          { userId: { $in: userIds } },
          { projection: { _id: 0, userId: 1, eventId: 1, status: 1 } }
        )
        .toArray()

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
      userIds.forEach((id) => {
        countersByUserId.set(id, {
          eventsUsersCount: 0,
          signedUpCount: 0,
          visitedClosedCount: 0,
          participantCount: 0,
          reserveCount: 0,
        })
      })

      eventsUsersRecords.forEach((entry) => {
        const userId = String(entry?.userId || '').trim()
        const counter = countersByUserId.get(userId)
        if (!counter) return

        const status = String(entry?.status || '').trim().toLowerCase()
        const eventId = String(entry?.eventId || '').trim()

        counter.eventsUsersCount += 1

        if (isSignedStatus(status)) counter.signedUpCount += 1
        if (isParticipantStatus(status)) counter.participantCount += 1
        if (status === 'reserve') counter.reserveCount += 1

        // "Посетил" считаем как participant в закрытом мероприятии.
        if (isParticipantStatus(status) && closedEventIds.has(eventId)) {
          counter.visitedClosedCount += 1
        }
      })

      userIds.forEach((userId) => {
        const source = uniqueByUserId.get(userId)
        const counts = countersByUserId.get(userId)
        rows.push({
          city: location,
          location,
          dbName,
          userId,
          fullName: buildFullName(source),
          firstName: source.firstName || '',
          secondName: source.secondName || '',
          rawPhone: source.rawPhone ?? '',
          normalizedPhone: source.normalizedPhone ?? '',
          status: source.status ?? '',
          role: source.role ?? '',
          eventsUsersCount: counts?.eventsUsersCount || 0,
          signedUpCount: counts?.signedUpCount || 0,
          visitedClosedCount: counts?.visitedClosedCount || 0,
          participantCount: counts?.participantCount || 0,
          reserveCount: counts?.reserveCount || 0,
          userUrl: `/${location}/user/${userId}`,
        })
      })
    }
  } finally {
    await client.close()
  }

  const summaryByLocation = LOCATIONS.reduce((acc, location) => {
    const locationRows = rows.filter((row) => row.location === location)
    acc[location] = {
      invalidUsers: locationRows.length,
      withAnyEventRecord: locationRows.filter((row) => row.eventsUsersCount > 0)
        .length,
      totalSignedUpCount: locationRows.reduce(
        (sum, row) => sum + row.signedUpCount,
        0
      ),
      totalVisitedClosedCount: locationRows.reduce(
        (sum, row) => sum + row.visitedClosedCount,
        0
      ),
    }
    return acc
  }, {})

  const report = {
    mode: 'invalid-phones-events-report',
    startedFromReport: sourceReportPath,
    generatedAt: new Date().toISOString(),
    env: {
      dbSuffix: DB_SUFFIX || null,
    },
    summary: {
      totalInvalidUsers: rows.length,
      withAnyEventRecord: rows.filter((row) => row.eventsUsersCount > 0).length,
      withVisitedClosedCount: rows.filter((row) => row.visitedClosedCount > 0)
        .length,
      byLocation: summaryByLocation,
    },
    rows,
    notes: {
      visitedDefinition:
        'visitedClosedCount = записи eventsusers со status=participant в мероприятиях events.status=closed',
      signedDefinition:
        'signedUpCount = записи eventsusers со status in [participant,reserve]',
    },
  }

  const reportsDir = path.join(process.cwd(), 'docs', 'reports')
  fs.mkdirSync(reportsDir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const jsonPath = path.join(reportsDir, `invalid-phones-events-${stamp}.json`)
  const csvPath = path.join(reportsDir, `invalid-phones-events-${stamp}.csv`)

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8')

  const header = [
    'city',
    'location',
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
    'signedUpCount',
    'visitedClosedCount',
    'participantCount',
    'reserveCount',
    'userUrl',
  ]

  const body = rows.map((row) =>
    [
      row.city,
      row.location,
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
      row.signedUpCount,
      row.visitedClosedCount,
      row.participantCount,
      row.reserveCount,
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

  console.log('Invalid phones events report completed')
  console.log('Source dry-run report:', sourceReportPath)
  console.log('JSON:', jsonPath)
  console.log('CSV:', csvPath)
  console.log('Summary:', JSON.stringify(report.summary, null, 2))
}

main().catch((error) => {
  console.error('Invalid phones events report failed:', error.message)
  process.exit(1)
})
