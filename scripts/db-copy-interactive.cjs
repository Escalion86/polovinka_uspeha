const { MongoClient } = require('mongodb')
const { loadEnvConfig } = require('@next/env')
const readline = require('readline/promises')
const { stdin: input, stdout: output } = require('node:process')

loadEnvConfig(process.cwd())

const DEFAULT_BATCH_SIZE = 1000

const askWithDefault = async (rl, question, defaultValue = '') => {
  const suffix = defaultValue ? ` [${defaultValue}]` : ''
  const value = (await rl.question(`${question}${suffix}: `)).trim()
  return value || defaultValue
}

const askYesNo = async (rl, question, defaultYes = true) => {
  const hint = defaultYes ? 'Y/n' : 'y/N'
  const value = (await rl.question(`${question} (${hint}): `)).trim().toLowerCase()
  if (!value) return defaultYes
  if (['y', 'yes', 'д', 'да'].includes(value)) return true
  if (['n', 'no', 'н', 'нет'].includes(value)) return false
  return defaultYes
}

const formatDuration = (startMs) => {
  const seconds = Math.round((Date.now() - startMs) / 1000)
  if (seconds < 60) return `${seconds} c`
  const mins = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${mins} мин ${sec} c`
}

const copyCollectionData = async ({
  sourceCollection,
  targetCollection,
  batchSize,
  totalDocs,
}) => {
  const cursor = sourceCollection.find({})
  let batch = []
  let copied = 0

  for await (const doc of cursor) {
    batch.push(doc)
    if (batch.length >= batchSize) {
      await targetCollection.insertMany(batch, { ordered: false })
      copied += batch.length
      batch = []
      if (totalDocs > 0) {
        const percent = ((copied / totalDocs) * 100).toFixed(1)
        output.write(`\r      прогресс: ${copied}/${totalDocs} (${percent}%)`)
      } else {
        output.write(`\r      прогресс: ${copied}`)
      }
    }
  }

  if (batch.length > 0) {
    await targetCollection.insertMany(batch, { ordered: false })
    copied += batch.length
  }

  output.write('\n')
  return copied
}

const copyIndexes = async (sourceCollection, targetCollection) => {
  const indexes = await sourceCollection.indexes()
  const customIndexes = indexes.filter((index) => index.name !== '_id_')
  for (const index of customIndexes) {
    const { key, name, ...options } = index
    await targetCollection.createIndex(key, { ...options, name })
  }
  return customIndexes.length
}

async function main() {
  const rl = readline.createInterface({ input, output })

  let sourceClient
  let targetClient

  try {
    console.log('')
    console.log('=== Копирование MongoDB (интерактивный режим) ===')
    console.log('Важно: для VPS через localhost сначала поднимите SSH-туннель.')
    console.log('')

    const sourceUriDefault =
      process.env.VPS_TUNNEL_MONGODB_URI ||
      process.env.REMOTE_MONGODB_URI ||
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27018/?authSource=admin'

    const targetUriDefault =
      process.env.LOCAL_MONGODB_URI ||
      process.env.MONGODB_LOCAL_URI ||
      'mongodb://127.0.0.1:27017/?authSource=admin'

    const sourceUri = await askWithDefault(
      rl,
      'URI источника (VPS через туннель)',
      sourceUriDefault
    )
    const sourceDbName = await askWithDefault(rl, 'Имя исходной БД (на VPS)')
    const targetUri = await askWithDefault(
      rl,
      'URI назначения (локальная MongoDB)',
      targetUriDefault
    )
    const targetDbName = await askWithDefault(rl, 'Имя целевой локальной БД')

    const dropTarget = await askYesNo(
      rl,
      `Удалить целевую БД "${targetDbName}" перед копированием`,
      true
    )
    const copyIndexesFlag = await askYesNo(rl, 'Копировать индексы', true)
    const batchSizeRaw = await askWithDefault(
      rl,
      'Размер batch для insertMany',
      String(DEFAULT_BATCH_SIZE)
    )
    const batchSize = Math.max(1, Number.parseInt(batchSizeRaw, 10) || DEFAULT_BATCH_SIZE)

    if (!sourceDbName) throw new Error('Имя исходной БД обязательно')
    if (!targetDbName) throw new Error('Имя целевой БД обязательно')
    if (sourceUri === targetUri && sourceDbName === targetDbName) {
      throw new Error('Источник и цель совпадают. Операция остановлена.')
    }

    console.log('')
    console.log('--- Подтверждение ---')
    console.log(`Источник: ${sourceDbName}`)
    console.log(`URI источника: ${sourceUri}`)
    console.log(`Назначение: ${targetDbName}`)
    console.log(`URI назначения: ${targetUri}`)
    console.log(`Удалять целевую БД: ${dropTarget ? 'да' : 'нет'}`)
    console.log(`Копировать индексы: ${copyIndexesFlag ? 'да' : 'нет'}`)
    console.log(`Batch size: ${batchSize}`)
    console.log('')

    const confirmed = await askYesNo(rl, 'Начать копирование', true)
    if (!confirmed) {
      console.log('Операция отменена пользователем.')
      return
    }

    const startedAt = Date.now()
    sourceClient = new MongoClient(sourceUri)
    targetClient = new MongoClient(targetUri)
    await sourceClient.connect()
    await targetClient.connect()

    const sourceDb = sourceClient.db(sourceDbName)
    const targetDb = targetClient.db(targetDbName)

    if (dropTarget) {
      await targetDb.dropDatabase().catch(() => {})
      console.log(`Целевая БД "${targetDbName}" очищена.`)
    }

    const collections = await sourceDb
      .listCollections({}, { nameOnly: false })
      .toArray()

    const regularCollections = collections.filter(
      (info) => !info.type || info.type === 'collection'
    )

    let totalCopiedDocs = 0
    let totalIndexesCopied = 0

    console.log('')
    console.log(`Коллекций к копированию: ${regularCollections.length}`)

    for (const info of regularCollections) {
      const name = info.name
      const sourceCollection = sourceDb.collection(name)
      const targetCollection = targetDb.collection(name)
      const totalDocs = await sourceCollection.estimatedDocumentCount()
      const collectionStart = Date.now()

      console.log('')
      console.log(`-> ${name} (документов: ~${totalDocs})`)
      const copied = await copyCollectionData({
        sourceCollection,
        targetCollection,
        batchSize,
        totalDocs,
      })
      totalCopiedDocs += copied

      let copiedIndexes = 0
      if (copyIndexesFlag) {
        copiedIndexes = await copyIndexes(sourceCollection, targetCollection)
        totalIndexesCopied += copiedIndexes
      }

      console.log(
        `   готово: документов ${copied}, индексов ${copiedIndexes}, время ${formatDuration(
          collectionStart
        )}`
      )
    }

    console.log('')
    console.log('=== Готово ===')
    console.log(`Скопировано документов: ${totalCopiedDocs}`)
    console.log(`Скопировано индексов: ${totalIndexesCopied}`)
    console.log(`Общее время: ${formatDuration(startedAt)}`)
  } finally {
    rl.close()
    if (sourceClient) await sourceClient.close().catch(() => {})
    if (targetClient) await targetClient.close().catch(() => {})
  }
}

main().catch((error) => {
  console.error('')
  console.error('Копирование завершилось с ошибкой:')
  console.error(error.message)
  process.exit(1)
})
