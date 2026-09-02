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
const DB_SUFFIX = process.env.VERIFY_GLOBAL_LINKS_DB_SUFFIX || ''
const SUMMARY_ONLY = process.argv.includes('--summary-only')

const nowIso = () => new Date().toISOString()

const countIssuesByLocation = (issues = []) =>
  issues.reduce((counts, issue) => {
    const location = LOCATIONS.includes(issue?.location)
      ? issue.location
      : 'unknown'
    counts[location] = (counts[location] || 0) + 1
    return counts
  }, {})

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

async function main() {
  const mongoUri = process.env.MONGODB_URI
  const globalDbNameRaw = process.env.MONGODB_GLOBAL_DBNAME
  if (!mongoUri) throw new Error('MONGODB_URI is required')
  if (!globalDbNameRaw) throw new Error('MONGODB_GLOBAL_DBNAME is required')

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

  const startedAt = nowIso()
  const globalDbName = `${globalDbNameRaw}${DB_SUFFIX}`
  const client = new MongoClient(mongoUri)

  const report = {
    mode: SUMMARY_ONLY ? 'verify-global-links-summary' : 'verify-global-links',
    startedAt,
    finishedAt: null,
    env: {
      dbSuffix: DB_SUFFIX || null,
      globalDbName,
      locations: LOCATIONS,
    },
    summary: {},
    issues: {
      localMissingGlobalUserId: [],
      localInvalidGlobalUserId: [],
      localGlobalUserNotFound: [],
      localPhoneMismatchWithGlobal: [],
      localCityProfileMissing: [],
      localCityProfileUserIdMismatch: [],
      reverseLocalUserNotFound: [],
      reverseLocalGlobalUserIdMismatch: [],
      reverseLocalPhoneMismatch: [],
    },
  }

  try {
    await client.connect()

    const globalDb = client.db(globalDbName)
    const globalUsersCollection = globalDb.collection('globalusers')

    const cityDbByLocation = {}
    const localUsersByCity = {}
    let localUsersTotal = 0

    for (const location of LOCATIONS) {
      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const cityDb = client.db(dbName)
      cityDbByLocation[location] = cityDb
      const users = await cityDb
        .collection('users')
        .find(
          {},
          {
            projection: {
              _id: 1,
              phone: 1,
              globalUserId: 1,
            },
          }
        )
        .toArray()

      localUsersTotal += users.length
      localUsersByCity[location] = new Map(
        users.map((user) => [
          String(user._id),
          {
            _id: String(user._id),
            phone: user.phone ?? null,
            normalizedPhone: normalizePhone(user.phone),
            globalUserId:
              user.globalUserId === null || typeof user.globalUserId === 'undefined'
                ? null
                : String(user.globalUserId),
          },
        ])
      )
    }

    const globalUsers = await globalUsersCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            phone: 1,
            cityProfiles: 1,
          },
        }
      )
      .toArray()

    const globalById = new Map(
      globalUsers.map((doc) => [String(doc._id), doc])
    )

    for (const location of LOCATIONS) {
      localUsersByCity[location].forEach((localUser) => {
        if (!localUser.globalUserId) {
          report.issues.localMissingGlobalUserId.push({
            location,
            userId: localUser._id,
            phone: localUser.phone,
          })
          return
        }

        if (!ObjectId.isValid(localUser.globalUserId)) {
          report.issues.localInvalidGlobalUserId.push({
            location,
            userId: localUser._id,
            globalUserId: localUser.globalUserId,
          })
          return
        }

        const globalUser = globalById.get(localUser.globalUserId)
        if (!globalUser?._id) {
          report.issues.localGlobalUserNotFound.push({
            location,
            userId: localUser._id,
            globalUserId: localUser.globalUserId,
          })
          return
        }

        const globalPhoneNormalized = normalizePhone(globalUser.phone)
        if (
          localUser.normalizedPhone &&
          globalPhoneNormalized &&
          localUser.normalizedPhone !== globalPhoneNormalized
        ) {
          report.issues.localPhoneMismatchWithGlobal.push({
            location,
            userId: localUser._id,
            globalUserId: localUser.globalUserId,
            localPhone: localUser.phone,
            globalPhone: globalUser.phone,
          })
        }

        const cityProfiles =
          globalUser.cityProfiles && typeof globalUser.cityProfiles === 'object'
            ? globalUser.cityProfiles
            : {}
        const cityProfile = cityProfiles[location]

        if (!cityProfile) {
          report.issues.localCityProfileMissing.push({
            location,
            userId: localUser._id,
            globalUserId: localUser.globalUserId,
          })
          return
        }

        if (String(cityProfile.userId || '') !== localUser._id) {
          report.issues.localCityProfileUserIdMismatch.push({
            location,
            userId: localUser._id,
            globalUserId: localUser.globalUserId,
            cityProfileUserId: cityProfile.userId ?? null,
          })
        }
      })
    }

    globalUsers.forEach((globalUser) => {
      const globalUserId = String(globalUser._id)
      const globalPhone = globalUser.phone ?? null
      const globalPhoneNormalized = normalizePhone(globalPhone)

      const cityProfiles =
        globalUser.cityProfiles && typeof globalUser.cityProfiles === 'object'
          ? globalUser.cityProfiles
          : {}

      Object.entries(cityProfiles).forEach(([location, profile]) => {
        if (!LOCATIONS.includes(location)) return
        const localUserId = String(profile?.userId || '')
        if (!localUserId) return

        const localUser = localUsersByCity[location]?.get(localUserId)
        if (!localUser) {
          report.issues.reverseLocalUserNotFound.push({
            location,
            globalUserId,
            cityProfileUserId: localUserId,
          })
          return
        }

        if (String(localUser.globalUserId || '') !== globalUserId) {
          report.issues.reverseLocalGlobalUserIdMismatch.push({
            location,
            userId: localUser._id,
            localGlobalUserId: localUser.globalUserId,
            expectedGlobalUserId: globalUserId,
          })
        }

        if (
          localUser.normalizedPhone &&
          globalPhoneNormalized &&
          localUser.normalizedPhone !== globalPhoneNormalized
        ) {
          report.issues.reverseLocalPhoneMismatch.push({
            location,
            userId: localUser._id,
            globalUserId,
            localPhone: localUser.phone,
            globalPhone,
          })
        }
      })
    })

    report.finishedAt = nowIso()
    report.summary = {
      localUsersTotal,
      globalUsersTotal: globalUsers.length,
      localMissingGlobalUserId: report.issues.localMissingGlobalUserId.length,
      localInvalidGlobalUserId: report.issues.localInvalidGlobalUserId.length,
      localGlobalUserNotFound: report.issues.localGlobalUserNotFound.length,
      localPhoneMismatchWithGlobal:
        report.issues.localPhoneMismatchWithGlobal.length,
      localCityProfileMissing: report.issues.localCityProfileMissing.length,
      localCityProfileUserIdMismatch:
        report.issues.localCityProfileUserIdMismatch.length,
      reverseLocalUserNotFound: report.issues.reverseLocalUserNotFound.length,
      reverseLocalGlobalUserIdMismatch:
        report.issues.reverseLocalGlobalUserIdMismatch.length,
      reverseLocalPhoneMismatch: report.issues.reverseLocalPhoneMismatch.length,
      issuesByLocation: Object.fromEntries(
        Object.entries(report.issues).map(([key, issues]) => [
          key,
          countIssuesByLocation(issues),
        ])
      ),
    }

    if (SUMMARY_ONLY) {
      report.issues = Object.fromEntries(
        Object.entries(report.issues).map(([key, issues]) => [key, issues.length])
      )
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(reportsDir, `verify-global-links-${stamp}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

    console.log('Verify global links completed')
    console.log('Report:', reportPath)
    console.log('Summary:', JSON.stringify(report.summary, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('Verify global links failed:', error.message)
  process.exit(1)
})
