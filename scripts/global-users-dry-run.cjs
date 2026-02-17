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
const DB_SUFFIX = process.env.GLOBAL_USERS_DRY_RUN_DB_SUFFIX || ''

const nowIso = () => new Date().toISOString()

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

const firstNonEmpty = (values) =>
  values.find((v) => v !== null && v !== undefined && String(v).trim() !== '') ??
  null

const getDistinctNonEmpty = (values) => {
  const set = new Set()
  values.forEach((value) => {
    if (value === null || value === undefined) return
    const trimmed = String(value).trim()
    if (!trimmed) return
    set.add(trimmed)
  })
  return Array.from(set)
}

async function main() {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required')
  }

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

  const globalDbName = process.env.MONGODB_GLOBAL_DBNAME
    ? `${process.env.MONGODB_GLOBAL_DBNAME}${DB_SUFFIX}`
    : null
  const startedAt = nowIso()
  const client = new MongoClient(mongoUri)

  const usersByPhone = new Map()
  const invalidPhones = []
  const duplicatePhonesWithinCity = []
  const perCityTotals = {}

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
              gender: 1,
              birthday: 1,
              images: 1,
              phone: 1,
              role: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          }
        )
        .toArray()

      perCityTotals[location] = users.length

      const cityPhoneCounter = new Map()

      users.forEach((user) => {
        const normalizedPhone = normalizePhone(user.phone)
        const valid = isValidPhone(normalizedPhone)

        const record = {
          city: location,
          userId: String(user._id),
          rawPhone: user.phone ?? null,
          normalizedPhone,
          valid,
          firstName: user.firstName ?? '',
          secondName: user.secondName ?? '',
          gender: user.gender ?? null,
          birthday: user.birthday ?? null,
          imagesCount: Array.isArray(user.images) ? user.images.length : 0,
          role: user.role ?? null,
          status: user.status ?? null,
          createdAt: user.createdAt ?? null,
          updatedAt: user.updatedAt ?? null,
        }

        if (!valid) {
          invalidPhones.push(record)
          return
        }

        cityPhoneCounter.set(
          normalizedPhone,
          (cityPhoneCounter.get(normalizedPhone) || 0) + 1
        )

        if (!usersByPhone.has(normalizedPhone)) {
          usersByPhone.set(normalizedPhone, [])
        }
        usersByPhone.get(normalizedPhone).push(record)
      })

      cityPhoneCounter.forEach((count, phone) => {
        if (count > 1) {
          duplicatePhonesWithinCity.push({ city: location, phone, count })
        }
      })
    }

    const candidates = []
    const conflicts = []
    let crossCityUsers = 0

    usersByPhone.forEach((records, phone) => {
      const citySet = new Set(records.map((r) => r.city))
      if (citySet.size > 1) crossCityUsers += 1

      const firstNames = getDistinctNonEmpty(records.map((r) => r.firstName))
      const secondNames = getDistinctNonEmpty(records.map((r) => r.secondName))
      const genders = getDistinctNonEmpty(records.map((r) => r.gender))
      const birthdays = getDistinctNonEmpty(
        records.map((r) =>
          r.birthday ? new Date(r.birthday).toISOString().slice(0, 10) : null
        )
      )

      const fieldConflicts = {}
      if (firstNames.length > 1) fieldConflicts.firstName = firstNames
      if (secondNames.length > 1) fieldConflicts.secondName = secondNames
      if (genders.length > 1) fieldConflicts.gender = genders
      if (birthdays.length > 1) fieldConflicts.birthday = birthdays

      if (Object.keys(fieldConflicts).length > 0) {
        conflicts.push({
          phone,
          cities: Array.from(citySet),
          fieldConflicts,
          records,
        })
      }

      candidates.push({
        phone,
        sourceRecordsCount: records.length,
        cities: Array.from(citySet),
        cityProfiles: records.reduce((acc, rec) => {
          acc[rec.city] = {
            userId: rec.userId,
            status: rec.status,
            role: rec.role,
            linkedAt: rec.updatedAt || rec.createdAt || null,
          }
          return acc
        }, {}),
        profile: {
          firstName: firstNonEmpty(records.map((r) => r.firstName)) || '',
          secondName: firstNonEmpty(records.map((r) => r.secondName)) || '',
          gender: firstNonEmpty(records.map((r) => r.gender)),
          birthday: firstNonEmpty(records.map((r) => r.birthday)),
          imagesCountTotal: records.reduce((sum, rec) => sum + rec.imagesCount, 0),
        },
      })
    })

    let existingGlobalUsersCount = null
    let wouldCreateGlobalUsers = candidates.length
    let wouldUpdateGlobalUsers = 0

    if (globalDbName) {
      const globalDb = client.db(globalDbName)
      existingGlobalUsersCount = await globalDb.collection('globalusers').countDocuments({})

      const existingPhones = new Set(
        await globalDb
          .collection('globalusers')
          .find({}, { projection: { _id: 0, phone: 1 } })
          .map((doc) => String(doc.phone))
          .toArray()
      )

      wouldCreateGlobalUsers = 0
      candidates.forEach((candidate) => {
        if (existingPhones.has(String(candidate.phone))) {
          wouldUpdateGlobalUsers += 1
        } else {
          wouldCreateGlobalUsers += 1
        }
      })
    }

    const finishedAt = nowIso()
    const report = {
      mode: 'dry-run',
      startedAt,
      finishedAt,
      env: {
        hasGlobalDb: Boolean(globalDbName),
        globalDbName: globalDbName || null,
        dbSuffix: DB_SUFFIX || null,
        locations: LOCATIONS,
      },
      summary: {
        totalUsersRead: Object.values(perCityTotals).reduce((sum, n) => sum + n, 0),
        perCityTotals,
        validPhonesUnique: candidates.length,
        invalidPhones: invalidPhones.length,
        duplicatePhonesWithinCity: duplicatePhonesWithinCity.length,
        crossCityUsers,
        conflicts: conflicts.length,
        existingGlobalUsersCount,
        wouldCreateGlobalUsers,
        wouldUpdateGlobalUsers,
      },
      duplicatePhonesWithinCity,
      invalidPhones,
      conflicts,
      candidates,
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filePath = path.join(reportsDir, `global-users-dry-run-${stamp}.json`)
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8')

    console.log('GlobalUsers dry-run completed')
    console.log('Report:', filePath)
    console.log('Summary:', JSON.stringify(report.summary, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('GlobalUsers dry-run failed:', error.message)
  process.exit(1)
})
