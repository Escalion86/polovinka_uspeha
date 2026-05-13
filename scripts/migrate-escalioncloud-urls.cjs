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

const argv = process.argv.slice(2)
const WRITE_MODE = argv.includes('--write')
const DB_SUFFIX = process.env.MIGRATE_ESCALIONCLOUD_URLS_DB_SUFFIX || ''
const REPORT_EXAMPLES_LIMIT = 100

const DOMAIN_PATTERN = '(?:escalioncloud|esclioncloud)\\.ru'
const REPLACEMENTS = [
  {
    from: new RegExp(`(https?:\\/\\/)api\\.${DOMAIN_PATTERN}\\/api\\b`, 'gi'),
    to: '$1cloud.escalion.ru/api',
  },
  {
    from: new RegExp(`(https?:\\/\\/)api\\.${DOMAIN_PATTERN}\\b`, 'gi'),
    to: '$1cloud.escalion.ru/api',
  },
  {
    from: new RegExp(`\\bapi\\.${DOMAIN_PATTERN}\\/api\\b`, 'gi'),
    to: 'cloud.escalion.ru/api',
  },
  {
    from: new RegExp(`\\bapi\\.${DOMAIN_PATTERN}\\b`, 'gi'),
    to: 'cloud.escalion.ru/api',
  },
  {
    from: new RegExp(`\\b${DOMAIN_PATTERN}\\b`, 'gi'),
    to: 'cloud.escalion.ru',
  },
]

const isPlainObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  (Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null)

const replaceString = (value) =>
  REPLACEMENTS.reduce(
    (currentValue, replacement) =>
      currentValue.replace(replacement.from, replacement.to),
    value
  )

const migrateValue = (value, fieldPath = '') => {
  if (typeof value === 'string') {
    const nextValue = replaceString(value)
    return {
      value: nextValue,
      changed: nextValue !== value,
      changedPaths: nextValue !== value ? [fieldPath || '<root>'] : [],
    }
  }

  if (Array.isArray(value)) {
    let changed = false
    const changedPaths = []
    const nextValue = value.map((item, index) => {
      const result = migrateValue(item, `${fieldPath}[${index}]`)
      if (result.changed) {
        changed = true
        changedPaths.push(...result.changedPaths)
      }
      return result.value
    })

    return { value: nextValue, changed, changedPaths }
  }

  if (isPlainObject(value)) {
    let changed = false
    const changedPaths = []
    const nextValue = {}

    for (const [key, childValue] of Object.entries(value)) {
      const childPath = fieldPath ? `${fieldPath}.${key}` : key
      const result = migrateValue(childValue, childPath)
      if (result.changed) {
        changed = true
        changedPaths.push(...result.changedPaths)
      }
      nextValue[key] = result.value
    }

    return { value: nextValue, changed, changedPaths }
  }

  return { value, changed: false, changedPaths: [] }
}

const getTargetDbs = () => {
  const cityDbs = LOCATIONS.map((location) => {
    const dbName = process.env[DB_ENV_MAP[location]]
    if (!dbName) {
      throw new Error(`Missing db name: ${DB_ENV_MAP[location]}`)
    }

    return {
      key: location,
      dbName: `${dbName}${DB_SUFFIX}`,
    }
  })

  const globalDbName = process.env.MONGODB_GLOBAL_DBNAME
  if (!globalDbName) {
    return cityDbs
  }

  return [
    ...cityDbs,
    {
      key: 'global',
      dbName: `${globalDbName}${DB_SUFFIX}`,
    },
  ]
}

async function processCollection(collection, dbKey, collectionName, examples) {
  const stats = {
    read: 0,
    wouldUpdate: 0,
    updated: 0,
  }

  const cursor = collection.find({})

  for await (const doc of cursor) {
    stats.read += 1
    const result = migrateValue(doc)
    if (!result.changed) continue

    stats.wouldUpdate += 1

    if (examples.length < REPORT_EXAMPLES_LIMIT) {
      examples.push({
        db: dbKey,
        collection: collectionName,
        id: String(doc._id),
        changedPaths: result.changedPaths.slice(0, 20),
      })
    }

    if (WRITE_MODE) {
      await collection.replaceOne({ _id: doc._id }, result.value)
      stats.updated += 1
    }
  }

  return stats
}

async function processDb(client, targetDb, examples) {
  const db = client.db(targetDb.dbName)
  const collections = await db.listCollections({}, { nameOnly: true }).toArray()
  const perCollection = {}
  const totals = {
    collectionsRead: collections.length,
    documentsRead: 0,
    documentsWouldUpdate: 0,
    documentsUpdated: 0,
  }

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name
    const collection = db.collection(collectionName)
    const stats = await processCollection(
      collection,
      targetDb.key,
      collectionName,
      examples
    )

    perCollection[collectionName] = stats
    totals.documentsRead += stats.read
    totals.documentsWouldUpdate += stats.wouldUpdate
    totals.documentsUpdated += stats.updated
  }

  return {
    dbName: targetDb.dbName,
    totals,
    perCollection,
  }
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is required')

  const startedAt = new Date().toISOString()
  const client = new MongoClient(uri)
  const examples = []
  const perDb = {}
  const summary = {
    dbsRead: 0,
    collectionsRead: 0,
    documentsRead: 0,
    documentsWouldUpdate: 0,
    documentsUpdated: 0,
  }

  try {
    await client.connect()

    const targetDbs = getTargetDbs()
    summary.dbsRead = targetDbs.length

    for (const targetDb of targetDbs) {
      const dbResult = await processDb(client, targetDb, examples)
      perDb[targetDb.key] = dbResult

      summary.collectionsRead += dbResult.totals.collectionsRead
      summary.documentsRead += dbResult.totals.documentsRead
      summary.documentsWouldUpdate += dbResult.totals.documentsWouldUpdate
      summary.documentsUpdated += dbResult.totals.documentsUpdated
    }

    const finishedAt = new Date().toISOString()
    const report = {
      mode: WRITE_MODE ? 'write' : 'dry-run',
      startedAt,
      finishedAt,
      env: {
        dbSuffix: DB_SUFFIX || null,
        includesGlobalDb: Boolean(process.env.MONGODB_GLOBAL_DBNAME),
      },
      replacements: [
        'api.escalioncloud.ru/api -> cloud.escalion.ru/api',
        'api.escalioncloud.ru -> cloud.escalion.ru/api',
        'escalioncloud.ru -> cloud.escalion.ru',
        'same replacements for typo esclioncloud.ru',
      ],
      summary,
      perDb,
      examples,
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const reportPath = path.join(
      reportsDir,
      `migrate-escalioncloud-urls-${stamp}.json`
    )
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

    console.log(
      JSON.stringify(
        {
          success: true,
          reportPath,
          summary,
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
  console.error('EscalionCloud URL migration failed:', error)
  process.exit(1)
})
