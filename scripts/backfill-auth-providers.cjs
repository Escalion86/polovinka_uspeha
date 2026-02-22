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
const ALLOWED_PROVIDERS = new Set(['phone', 'telegram', 'vk', 'global-link'])

const DB_SUFFIX = process.env.BACKFILL_AUTH_PROVIDERS_DB_SUFFIX || ''
const WRITE_MODE = process.argv.includes('--write')

const normalizeProvider = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  return ALLOWED_PROVIDERS.has(normalized) ? normalized : null
}

const inferPrimaryProvider = (user) => {
  const explicit = normalizeProvider(user.registrationType)
  if (explicit) return explicit

  if (String(user?.vk || '').trim()) return 'vk'

  const telegramId =
    user?.notifications?.telegram?.id ??
    user?.notifications?.get?.('telegram')?.id ??
    null
  if (telegramId) return 'telegram'

  return 'phone'
}

const buildProviders = (user, primaryProvider) => {
  const current = Array.isArray(user.authProviders)
    ? user.authProviders.map(normalizeProvider).filter(Boolean)
    : []

  const next = new Set(current)
  next.add(primaryProvider)

  if (String(user?.vk || '').trim()) next.add('vk')

  const telegramId =
    user?.notifications?.telegram?.id ??
    user?.notifications?.get?.('telegram')?.id ??
    null
  if (telegramId) next.add('telegram')

  return Array.from(next)
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
  const perLocation = {}
  const changedExamples = []
  let totalRead = 0
  let totalWouldUpdate = 0
  let totalUpdated = 0

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
              registrationType: 1,
              authProviders: 1,
              vk: 1,
              notifications: 1,
            },
          }
        )
        .toArray()

      let locationWouldUpdate = 0
      let locationUpdated = 0

      for (const user of users) {
        totalRead += 1
        const primaryProvider = inferPrimaryProvider(user)
        const nextProviders = buildProviders(user, primaryProvider)
        const currentProviders = Array.isArray(user.authProviders)
          ? user.authProviders.map(normalizeProvider).filter(Boolean)
          : []
        const currentType = normalizeProvider(user.registrationType)

        const needTypeUpdate = currentType !== primaryProvider
        const needProvidersUpdate =
          JSON.stringify(currentProviders) !== JSON.stringify(nextProviders)

        if (!needTypeUpdate && !needProvidersUpdate) continue

        locationWouldUpdate += 1
        totalWouldUpdate += 1

        if (changedExamples.length < 50) {
          changedExamples.push({
            location,
            userId: String(user._id),
            from: {
              registrationType: user.registrationType ?? null,
              authProviders: user.authProviders ?? null,
            },
            to: {
              registrationType: primaryProvider,
              authProviders: nextProviders,
            },
          })
        }

        if (WRITE_MODE) {
          await db.collection('users').updateOne(
            { _id: user._id },
            {
              $set: {
                registrationType: primaryProvider,
                authProviders: nextProviders,
              },
            }
          )
          locationUpdated += 1
          totalUpdated += 1
        }
      }

      perLocation[location] = {
        dbName,
        usersRead: users.length,
        usersWouldUpdate: locationWouldUpdate,
        usersUpdated: locationUpdated,
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
        totalUsersRead: totalRead,
        totalUsersWouldUpdate: totalWouldUpdate,
        totalUsersUpdated: totalUpdated,
      },
      perLocation,
      changedExamples,
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(
      reportsDir,
      `backfill-auth-providers-${stamp}.json`
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

