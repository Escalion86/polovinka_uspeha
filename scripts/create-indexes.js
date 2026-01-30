const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) return
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^"|"$/g, '')
    if (!process.env[key]) process.env[key] = value
  })
}

const getDbNameByLocation = (location) => {
  if (location === 'krsk') return process.env.MONGODB_KRSK_DBNAME
  if (location === 'nrsk') return process.env.MONGODB_NRSK_DBNAME
  if (location === 'ekb') return process.env.MONGODB_EKB_DBNAME
  return null
}

const ensureIndexes = async (conn) => {
  const tasks = [
    {
      name: 'events.dateStart',
      run: () => conn.collection('events').createIndex({ dateStart: 1 }),
    },
    {
      name: 'users.gender',
      run: () => conn.collection('users').createIndex({ gender: 1 }),
    },
    {
      name: 'users.status',
      run: () => conn.collection('users').createIndex({ status: 1 }),
    },
    {
      name: 'users.relationship',
      run: () => conn.collection('users').createIndex({ relationship: 1 }),
    },
    {
      name: 'eventsusers.userId',
      run: () => conn.collection('eventsusers').createIndex({ userId: 1 }),
    },
    {
      name: 'eventsusers.eventId',
      run: () => conn.collection('eventsusers').createIndex({ eventId: 1 }),
    },
    {
      name: 'eventsusers.eventId_userId',
      run: () =>
        conn.collection('eventsusers').createIndex({ eventId: 1, userId: 1 }),
    },
    {
      name: 'payments.userId',
      run: () => conn.collection('payments').createIndex({ userId: 1 }),
    },
    {
      name: 'payments.eventId',
      run: () => conn.collection('payments').createIndex({ eventId: 1 }),
    },
  ]

  for (const task of tasks) {
    const indexName = await task.run()
    console.log(`ok: ${task.name} -> ${indexName}`)
  }
}

const main = async () => {
  const arg = process.argv[2]

  loadEnvFile(path.resolve(process.cwd(), '.env'))
  loadEnvFile(path.resolve(process.cwd(), '.env.local'))

  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    console.log('MONGODB_URI is not set')
    process.exit(1)
  }

  const locations = ['krsk', 'nrsk', 'ekb']
  const locationsToProcess =
    !arg || arg === 'all' ? locations : [arg]

  for (const location of locationsToProcess) {
    const dbName = getDbNameByLocation(location)
    if (!dbName) {
      console.log(`Skip ${location}: db name is not set`)
      continue
    }

    let conn
    try {
      console.log(`\nProcessing ${location} (${dbName})`)
      conn = await mongoose.createConnection(mongoUri, { dbName }).asPromise()
      await ensureIndexes(conn)
    } catch (error) {
      console.error(`Failed to create indexes for ${location}:`, error)
      process.exitCode = 1
    } finally {
      if (conn) {
        await conn.close()
      }
    }
  }

  if (locationsToProcess.length === 0) {
    console.log('No locations to process')
  }
}

main()
