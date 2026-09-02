const fs = require('fs')
const path = require('path')
const { MongoClient } = require('mongodb')
const { loadEnvConfig } = require('@next/env')
const { classifyCityProfile } = require('./lib/global-city-profile-cleanup.cjs')

loadEnvConfig(process.cwd())

const LOCATIONS = ['krsk', 'nrsk', 'ekb']
const DB_ENV_MAP = {
  krsk: 'MONGODB_KRSK_DBNAME',
  nrsk: 'MONGODB_NRSK_DBNAME',
  ekb: 'MONGODB_EKB_DBNAME',
}
const isWriteMode = process.argv.includes('--write')
const backupConfirmed = process.argv.includes('--confirm-backup')
const maintenanceConfirmed = process.argv.includes('--confirm-maintenance')
const expectedCountArg = process.argv.find((arg) => arg.startsWith('--expected-count='))
const expectedCount = expectedCountArg ? Number(expectedCountArg.split('=')[1]) : NaN
const DB_SUFFIX = process.env.CLEANUP_GLOBAL_CITY_PROFILES_DB_SUFFIX || ''

const countByReasonAndLocation = (items) =>
  items.reduce((result, item) => {
    result[item.reason] = result[item.reason] || {}
    result[item.reason][item.location] =
      (result[item.reason][item.location] || 0) + 1
    return result
  }, {})

async function main() {
  if (isWriteMode && (!backupConfirmed || !maintenanceConfirmed ||
    !Number.isInteger(expectedCount) || expectedCount < 0)) {
    throw new Error('Write requires --confirm-backup --confirm-maintenance --expected-count=N from reviewed dry-run')
  }
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

  const startedAt = new Date().toISOString()
  const client = new MongoClient(mongoUri)
  const staleProfiles = []
  const manualReview = []
  let globalUsersScanned = 0
  let removedCount = 0

  try {
    await client.connect()
    const globalDb = client.db(`${globalDbNameRaw}${DB_SUFFIX}`)
    const globalCollection = globalDb.collection('globalusers')
    const localUsersByLocation = {}

    for (const location of LOCATIONS) {
      const localDb = client.db(
        `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      )
      const users = await localDb
        .collection('users')
        .find({}, { projection: { _id: 1, phone: 1, globalUserId: 1 } })
        .toArray()
      localUsersByLocation[location] = new Map(
        users.map((user) => [String(user._id), user])
      )
    }

    const globalUsers = await globalCollection.find(
      {},
      { projection: { _id: 1, phone: 1, cityProfiles: 1 } }
    ).toArray()
    const globalById = new Map(globalUsers.map((user) => [String(user._id), user]))

    for (const globalUser of globalUsers) {
      globalUsersScanned += 1
      const cityProfiles =
        globalUser.cityProfiles && typeof globalUser.cityProfiles === 'object'
          ? globalUser.cityProfiles
          : {}

      for (const [location, profile] of Object.entries(cityProfiles)) {
        if (!LOCATIONS.includes(location)) continue
        const result = classifyCityProfile({
          globalUser, location, users: localUsersByLocation[location], globalById,
        })
        if (!result) continue
        if (!result.removable) {
          manualReview.push({ location, reason: result.reason })
          continue
        }
        staleProfiles.push({ location, reason: result.reason, globalUser, profile })
      }
    }

    if (isWriteMode) {
      if (manualReview.length || staleProfiles.length !== expectedCount) {
        throw new Error('Cleanup plan changed or contains ambiguous links; repeat dry-run and review')
      }
      for (const { location, reason, globalUser, profile } of staleProfiles) {
        // Backup хранится в БД, не в git-отчете; требуется maintenance-окно без writers.
        await globalDb.collection('globalusers_cityprofile_cleanup_backups').insertOne({
          globalUserId: globalUser._id, location, profile, reason, createdAt: new Date(),
          runStartedAt: startedAt,
        })
        const updateResult = await globalCollection.updateOne(
            {
              _id: globalUser._id,
              phone: globalUser.phone,
              [`cityProfiles.${location}`]: profile,
            },
            {
              $unset: { [`cityProfiles.${location}`]: '' },
              $pull: { cities: location },
              $set: {
                'meta.lastStaleCityProfileCleanupAt': new Date(),
              },
            }
          )
        if (updateResult.matchedCount !== 1) {
          throw new Error('City profile changed during cleanup; stopped without replacing the new link')
        }
        removedCount += updateResult.modifiedCount
      }
    }

    const summary = {
      globalUsersScanned,
      staleProfilesFound: staleProfiles.length,
      removedCount,
      requiresManualReview: manualReview.length,
      manualReviewByReasonAndLocation: countByReasonAndLocation(manualReview),
      byReasonAndLocation: countByReasonAndLocation(staleProfiles),
    }
    const report = {
      mode: isWriteMode ? 'write-summary' : 'dry-run-summary',
      startedAt,
      finishedAt: new Date().toISOString(),
      summary,
    }
    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(
      reportsDir,
      `cleanup-stale-global-city-profiles-${stamp}.json`
    )
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

    console.log(
      `Stale GlobalUsers cityProfiles cleanup ${
        isWriteMode ? 'write' : 'dry-run'
      } completed`
    )
    console.log('Report:', reportPath)
    console.log('Summary:', JSON.stringify(summary, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('Stale GlobalUsers cityProfiles cleanup failed:', error.message)
  process.exit(1)
})
