const fs = require('fs')
const path = require('path')
const { MongoClient } = require('mongodb')
const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

const nowIso = () => new Date().toISOString()

async function main() {
  const mongoUri = process.env.MONGODB_URI
  const krskDbName = process.env.MONGODB_KRSK_DBNAME
  const globalDbName = process.env.MONGODB_GLOBAL_DBNAME
  const dryRun = process.argv.includes('--dry-run')

  if (!mongoUri) throw new Error('MONGODB_URI is required')
  if (!krskDbName) throw new Error('MONGODB_KRSK_DBNAME is required')
  if (!globalDbName) throw new Error('MONGODB_GLOBAL_DBNAME is required')

  const startedAt = nowIso()
  const client = new MongoClient(mongoUri)

  try {
    await client.connect()

    const krskDb = client.db(krskDbName)
    const globalDb = client.db(globalDbName)

    const sourceDoc = await krskDb.collection('sitesettings').findOne({})
    const sourceCards = Array.isArray(sourceDoc?.aboutSpaceCards)
      ? sourceDoc.aboutSpaceCards
      : []

    if (sourceCards.length === 0) {
      throw new Error(
        `No aboutSpaceCards found in source DB (${krskDbName}.sitesettings)`
      )
    }

    const normalizedCards = sourceCards.map((item, index) => ({
      id: item?.id ?? `about-${index}`,
      title: item?.title ?? '',
      text: item?.text ?? '',
      wide: Boolean(item?.wide),
      tone: item?.tone ?? 'white',
      bgMode: item?.bgMode ?? null,
      bgColor1: item?.bgColor1 ?? null,
      bgColor2: item?.bgColor2 ?? null,
      index: typeof item?.index === 'number' ? item.index : index,
    }))

    const previousGlobalDoc = await globalDb
      .collection('globalcontents')
      .findOne({ key: 'about-space-cards' })

    let writeResult = null
    if (!dryRun) {
      writeResult = await globalDb.collection('globalcontents').findOneAndUpdate(
        { key: 'about-space-cards' },
        {
          $set: {
            key: 'about-space-cards',
            aboutSpaceCards: normalizedCards,
            updatedBy: 'migration-script:krsk',
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        {
          upsert: true,
          returnDocument: 'after',
        }
      )
    }

    const report = {
      startedAt,
      finishedAt: nowIso(),
      mode: dryRun ? 'dry-run' : 'write',
      source: {
        dbName: krskDbName,
        collection: 'sitesettings',
        cardsCount: normalizedCards.length,
      },
      target: {
        dbName: globalDbName,
        collection: 'globalcontents',
        key: 'about-space-cards',
        previousCardsCount: Array.isArray(previousGlobalDoc?.aboutSpaceCards)
          ? previousGlobalDoc.aboutSpaceCards.length
          : 0,
        newCardsCount: dryRun
          ? normalizedCards.length
          : Array.isArray(writeResult?.value?.aboutSpaceCards)
            ? writeResult.value.aboutSpaceCards.length
            : normalizedCards.length,
      },
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filePath = path.join(
      reportsDir,
      `about-space-cards-global-migration-${stamp}.json`
    )
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8')

    console.log('AboutSpaceCards migration completed')
    console.log('Report:', filePath)
    console.log('Summary:', JSON.stringify(report, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('AboutSpaceCards migration failed:', error.message)
  process.exit(1)
})
