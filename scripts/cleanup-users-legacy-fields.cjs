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
const LEGACY_FIELDS = ['soctag', 'custag']
const DB_SUFFIX = process.env.CLEANUP_USERS_LEGACY_DB_SUFFIX || ''
const isWriteMode = process.argv.slice(2).includes('--write')

const nowIso = () => new Date().toISOString()

async function main() {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) throw new Error('MONGODB_URI is required')

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
  const perCity = {}
  let totalMatched = 0
  let totalModified = 0

  try {
    await client.connect()

    for (const location of LOCATIONS) {
      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const db = client.db(dbName)
      const users = db.collection('users')

      const filter = {
        $or: LEGACY_FIELDS.map((field) => ({ [field]: { $exists: true } })),
      }

      const matched = await users.countDocuments(filter)
      totalMatched += matched

      let modified = 0
      if (isWriteMode && matched > 0) {
        const result = await users.updateMany(filter, {
          $unset: {
            soctag: '',
            custag: '',
          },
        })
        modified = result.modifiedCount || 0
        totalModified += modified
      }

      perCity[location] = {
        dbName,
        matched,
        modified,
      }
    }

    const finishedAt = nowIso()
    const report = {
      mode: isWriteMode ? 'write' : 'dry-run',
      startedAt,
      finishedAt,
      env: {
        dbSuffix: DB_SUFFIX || null,
        fields: LEGACY_FIELDS,
      },
      summary: {
        totalMatched,
        totalModified,
      },
      perCity,
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(
      reportsDir,
      `cleanup-users-legacy-fields-${stamp}.json`
    )
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

    console.log(
      `Cleanup users legacy fields ${isWriteMode ? 'write' : 'dry-run'} completed`
    )
    console.log('Report:', reportPath)
    console.log('Summary:', JSON.stringify(report.summary, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('Cleanup users legacy fields failed:', error.message)
  process.exit(1)
})
