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

const DB_SUFFIX = process.env.FIND_DUPLICATES_DB_SUFFIX || ''

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
  const rows = []
  const duplicatesByCity = []
  const crossCityDuplicates = []

  try {
    await client.connect()

    const allRecordsByPhone = new Map()

    for (const location of LOCATIONS) {
      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const db = client.db(dbName)
      const eventUsersCountByUserId = new Map()

      const hasEventsUsersCollection = await db
        .listCollections({ name: 'eventsusers' }, { nameOnly: true })
        .hasNext()
      if (hasEventsUsersCollection) {
        const eventsUsersCounts = await db
          .collection('eventsusers')
          .aggregate([
            { $match: { userId: { $type: 'string', $ne: '' } } },
            { $group: { _id: '$userId', count: { $sum: 1 } } },
          ])
          .toArray()
        eventsUsersCounts.forEach((item) => {
          eventUsersCountByUserId.set(String(item._id), item.count)
        })
      }

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
              password: 1,
              notifications: 1,
              createdAt: 1,
              updatedAt: 1,
              status: 1,
              role: 1,
            },
          }
        )
        .toArray()

      const localMap = new Map()

      users.forEach((user) => {
        const normalizedPhone = normalizePhone(user.phone)
        if (!isValidPhone(normalizedPhone)) return

        const record = {
          location,
          dbName,
          userId: String(user._id),
          firstName: user.firstName || '',
          secondName: user.secondName || '',
          rawPhone: user.phone ?? '',
          normalizedPhone,
          status: user.status ?? '',
          role: user.role ?? '',
          hasPassword: Boolean(String(user.password ?? '').trim()),
          notifications: user.notifications ?? null,
          eventsUsersCount:
            eventUsersCountByUserId.get(String(user._id)) ?? 0,
          createdAt: user.createdAt ?? null,
          updatedAt: user.updatedAt ?? null,
          userUrl: `/${location}/user/${user._id}`,
        }

        if (!localMap.has(normalizedPhone)) localMap.set(normalizedPhone, [])
        localMap.get(normalizedPhone).push(record)

        if (!allRecordsByPhone.has(normalizedPhone)) {
          allRecordsByPhone.set(normalizedPhone, [])
        }
        allRecordsByPhone.get(normalizedPhone).push(record)
      })

      localMap.forEach((records, phone) => {
        if (records.length < 2) return

        duplicatesByCity.push({
          location,
          dbName,
          phone,
          count: records.length,
          users: records,
        })

        records.forEach((record, index) => {
          rows.push({
            type: 'within_city',
            location,
            dbName,
            phone,
            duplicateCount: records.length,
            order: index + 1,
            userId: record.userId,
            firstName: record.firstName,
            secondName: record.secondName,
            rawPhone: record.rawPhone,
            status: record.status,
            role: record.role,
            hasPassword: record.hasPassword,
            notifications: record.notifications,
            eventsUsersCount: record.eventsUsersCount,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            userUrl: record.userUrl,
          })
        })
      })
    }

    allRecordsByPhone.forEach((records, phone) => {
      const cities = Array.from(new Set(records.map((r) => r.location)))
      if (cities.length < 2) return
      crossCityDuplicates.push({
        phone,
        cities,
        count: records.length,
        users: records,
      })
    })

    const finishedAt = new Date().toISOString()
    const report = {
      mode: 'find-duplicates',
      startedAt,
      finishedAt,
      env: {
        dbSuffix: DB_SUFFIX || null,
      },
      summary: {
        duplicatesByCityGroups: duplicatesByCity.length,
        duplicatesByCityUsersTotal: duplicatesByCity.reduce(
          (sum, item) => sum + item.count,
          0
        ),
        crossCityGroups: crossCityDuplicates.length,
        crossCityUsersTotal: crossCityDuplicates.reduce(
          (sum, item) => sum + item.count,
          0
        ),
      },
      duplicatesByCity,
      crossCityDuplicates,
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const jsonPath = path.join(reportsDir, `duplicate-phones-${stamp}.json`)
    const csvPath = path.join(reportsDir, `duplicate-phones-${stamp}.csv`)

    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8')

    const csvHeader = [
      'type',
      'location',
      'dbName',
      'phone',
      'duplicateCount',
      'order',
      'userId',
      'firstName',
      'secondName',
      'rawPhone',
      'status',
      'role',
      'hasPassword',
      'notifications',
      'eventsUsersCount',
      'createdAt',
      'updatedAt',
      'userUrl',
    ]
    const csvBody = rows.map((row) =>
      [
        row.type,
        row.location,
        row.dbName,
        row.phone,
        row.duplicateCount,
        row.order,
        row.userId,
        row.firstName,
        row.secondName,
        row.rawPhone,
        row.status,
        row.role,
        row.hasPassword,
        row.notifications ? JSON.stringify(row.notifications) : '',
        row.eventsUsersCount,
        row.createdAt ? new Date(row.createdAt).toISOString() : '',
        row.updatedAt ? new Date(row.updatedAt).toISOString() : '',
        row.userUrl,
      ]
        .map(toCsvCell)
        .join(',')
    )

    fs.writeFileSync(
      csvPath,
      [csvHeader.map(toCsvCell).join(','), ...csvBody].join('\n'),
      'utf8'
    )

    console.log('Duplicate phones report completed')
    console.log('JSON:', jsonPath)
    console.log('CSV:', csvPath)
    console.log('Summary:', JSON.stringify(report.summary, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('Find duplicate phones failed:', error.message)
  process.exit(1)
})
