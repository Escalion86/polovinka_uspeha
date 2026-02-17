const { MongoClient } = require('mongodb')
const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

const SOURCE_DB_ENV_KEYS = [
  'MONGODB_KRSK_DBNAME',
  'MONGODB_NRSK_DBNAME',
  'MONGODB_EKB_DBNAME',
]

const BATCH_SIZE = 1000

const copyCollectionData = async (sourceCollection, targetCollection) => {
  const cursor = sourceCollection.find({})
  let batch = []
  let total = 0

  for await (const doc of cursor) {
    batch.push(doc)
    if (batch.length >= BATCH_SIZE) {
      await targetCollection.insertMany(batch, { ordered: false })
      total += batch.length
      batch = []
    }
  }

  if (batch.length > 0) {
    await targetCollection.insertMany(batch, { ordered: false })
    total += batch.length
  }

  return total
}

const copyIndexes = async (sourceCollection, targetCollection) => {
  const indexes = await sourceCollection.indexes()
  const customIndexes = indexes.filter((index) => index.name !== '_id_')

  for (const index of customIndexes) {
    const { key, name, ...options } = index
    await targetCollection.createIndex(key, { ...options, name })
  }
}

const cloneDb = async (client, sourceDbName, targetDbName) => {
  const sourceDb = client.db(sourceDbName)
  const targetDb = client.db(targetDbName)

  await targetDb.dropDatabase().catch(() => {})

  const collections = await sourceDb.listCollections({}, { nameOnly: false }).toArray()
  let copiedDocs = 0

  for (const collectionInfo of collections) {
    const collectionName = collectionInfo.name
    const sourceCollection = sourceDb.collection(collectionName)
    const targetCollection = targetDb.collection(collectionName)

    const count = await copyCollectionData(sourceCollection, targetCollection)
    copiedDocs += count
    await copyIndexes(sourceCollection, targetCollection)
  }

  return { collections: collections.length, copiedDocs }
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is required')
  }

  const missing = SOURCE_DB_ENV_KEYS.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing env keys: ${missing.join(', ')}`)
  }

  const client = new MongoClient(uri)
  try {
    await client.connect()

    console.log('Clone source DBs to test DBs started')
    for (const key of SOURCE_DB_ENV_KEYS) {
      const sourceDb = process.env[key]
      const targetDb = `${sourceDb}_test`
      console.log(`- ${sourceDb} -> ${targetDb}`)
      const result = await cloneDb(client, sourceDb, targetDb)
      console.log(
        `  copied collections: ${result.collections}, documents: ${result.copiedDocs}`
      )
    }
    console.log('Clone finished')
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('Clone failed:', error.message)
  process.exit(1)
})
