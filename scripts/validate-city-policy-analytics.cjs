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
const DB_SUFFIX = process.env.VALIDATE_CITY_POLICY_DB_SUFFIX || ''

const CITY_POLICIES_KEY = 'city-policies'
const CITIES_CONTENT_KEY = 'cities-catalog'

const nowIso = () => new Date().toISOString()

const toPlainObject = (value) => {
  if (!value || typeof value !== 'object') return {}
  return value
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
  const client = new MongoClient(mongoUri)
  const globalDbName = `${globalDbNameRaw}${DB_SUFFIX}`

  const report = {
    track: 'C1-T9',
    mode: 'analytics-validation',
    startedAt,
    finishedAt: null,
    env: {
      dbSuffix: DB_SUFFIX || null,
      globalDbName,
      locations: LOCATIONS,
    },
    cityPolicies: {},
    cityCatalog: {},
    metricsByLocation: {},
    summary: {},
  }

  try {
    await client.connect()

    const globalDb = client.db(globalDbName)
    const globalContent = globalDb.collection('globalcontents')

    const cityPoliciesDoc = await globalContent.findOne({ key: CITY_POLICIES_KEY })
    const cityCatalogDoc = await globalContent.findOne({ key: CITIES_CONTENT_KEY })

    const cityPolicies = toPlainObject(cityPoliciesDoc?.cityPolicies)
    const cityCatalog = Array.isArray(cityCatalogDoc?.cities) ? cityCatalogDoc.cities : []

    report.cityPolicies = cityPolicies
    report.cityCatalog = cityCatalog.reduce((acc, city) => {
      const slug = String(city?.slug || '').trim()
      if (!slug) return acc
      acc[slug] = {
        status: city?.status || null,
        isVisibleInPublicSelector: city?.isVisibleInPublicSelector ?? null,
      }
      return acc
    }, {})

    for (const location of LOCATIONS) {
      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const db = client.db(dbName)

      const [usersTotal, usersArchived, eventsTotal, eventsClosed, eventsActive, eventsUsersTotal, paymentsTotal] =
        await Promise.all([
          db.collection('users').countDocuments({}),
          db.collection('users').countDocuments({ archive: true }),
          db.collection('events').countDocuments({}),
          db.collection('events').countDocuments({ status: 'closed' }),
          db.collection('events').countDocuments({ status: { $in: ['active', 'waitlist'] } }),
          db.collection('eventsusers').countDocuments({}),
          db.collection('payments').countDocuments({}),
        ])

      report.metricsByLocation[location] = {
        dbName,
        policy: cityPolicies?.[location] || null,
        catalog: report.cityCatalog?.[location] || null,
        usersTotal,
        usersArchived,
        eventsTotal,
        eventsClosed,
        eventsActive,
        eventsUsersTotal,
        paymentsTotal,
      }
    }

    const nrskPolicy = cityPolicies?.nrsk || {}
    report.summary = {
      nrskStatus: nrskPolicy.status || null,
      nrskFlags: {
        allowRegistration: nrskPolicy.allowRegistration ?? null,
        allowEventSignup: nrskPolicy.allowEventSignup ?? null,
        allowEventManagement: nrskPolicy.allowEventManagement ?? null,
        allowPublicListing: nrskPolicy.allowPublicListing ?? null,
        allowLogin: nrskPolicy.allowLogin ?? null,
      },
      checks: {
        nrskWriteActionsBlockedExpected:
          nrskPolicy.allowRegistration === false &&
          nrskPolicy.allowEventSignup === false &&
          nrskPolicy.allowEventManagement === false,
        nrskHistoryStillPresent:
          (report.metricsByLocation?.nrsk?.eventsTotal || 0) > 0 ||
          (report.metricsByLocation?.nrsk?.paymentsTotal || 0) > 0,
      },
    }

    report.finishedAt = nowIso()
    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(reportsDir, `city-policy-analytics-${stamp}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

    console.log('City policy analytics validation completed')
    console.log('Report:', reportPath)
    console.log('Summary:', JSON.stringify(report.summary, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('City policy analytics validation failed:', error.message)
  process.exit(1)
})

