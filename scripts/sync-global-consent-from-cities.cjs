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
const isWriteMode = argv.includes('--write')
const DB_SUFFIX = process.env.SYNC_GLOBAL_CONSENT_DB_SUFFIX || ''

const normalizePhone = (rawValue) => {
  if (rawValue === null || typeof rawValue === 'undefined') return ''

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

  const client = new MongoClient(mongoUri)
  const consentPhones = new Set()
  const totalsByCity = {}

  try {
    await client.connect()

    for (const location of LOCATIONS) {
      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const db = client.db(dbName)

      const users = await db
        .collection('users')
        .find(
          { consentToMailing: true },
          { projection: { _id: 1, phone: 1, consentToMailing: 1 } }
        )
        .toArray()

      totalsByCity[location] = users.length
      users.forEach((user) => {
        const normalizedPhone = normalizePhone(user?.phone)
        if (/^7\d{10}$/.test(normalizedPhone)) {
          consentPhones.add(Number(normalizedPhone))
        }
      })
    }

    const globalDbName = `${globalDbNameRaw}${DB_SUFFIX}`
    const globalDb = client.db(globalDbName)
    const globalUsersCollection = globalDb.collection('globalusers')

    const consentPhonesArray = [...consentPhones]
    const matchedGlobalUsers =
      consentPhonesArray.length > 0
        ? await globalUsersCollection.countDocuments({
            phone: { $in: consentPhonesArray },
          })
        : 0

    const updateFilter = {
      phone: { $in: consentPhonesArray },
      'notifications.consentToMailing': { $ne: true },
    }

    const updatesCount =
      consentPhonesArray.length > 0
        ? await globalUsersCollection.countDocuments(updateFilter)
        : 0

    let modifiedCount = 0
    if (isWriteMode && consentPhonesArray.length > 0) {
      const writeResult = await globalUsersCollection.updateMany(updateFilter, {
        $set: {
          'notifications.consentToMailing': true,
        },
      })
      modifiedCount = writeResult.modifiedCount || 0
    }

    console.log('Sync global consent from cities completed')
    console.log(
      JSON.stringify(
        {
          mode: isWriteMode ? 'write' : 'dry-run',
          dbSuffix: DB_SUFFIX,
          totalsByCity,
          consentPhonesCount: consentPhonesArray.length,
          matchedGlobalUsers,
          willUpdateGlobalUsers: updatesCount,
          modifiedCount,
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
  console.error('Sync global consent from cities failed:', error.message)
  process.exitCode = 1
})
