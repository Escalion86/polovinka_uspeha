import mongoose from 'mongoose'
import globalUsersSchema from '@schemas/globalUsersSchema'

const GLOBAL_CONNECTION_KEY = 'global'

let connections = global.mongooseGlobal

if (!connections) {
  connections = global.mongooseGlobal = {}
}

const getGlobalDbName = () => process.env.MONGODB_GLOBAL_DBNAME

async function dbConnectGlobal() {
  const uri = process.env.MONGODB_URI
  const dbName = getGlobalDbName()

  if (!uri) {
    console.log('dbConnectGlobal: missing MONGODB_URI')
    return
  }

  if (!dbName) {
    console.log('dbConnectGlobal: missing MONGODB_GLOBAL_DBNAME')
    return
  }

  if (!connections[GLOBAL_CONNECTION_KEY]) {
    console.log('')
    console.log('------------------------------')
    console.log('dbConnectGlobal: create connection', dbName)
    console.log('------------------------------')
    console.log('')

    connections[GLOBAL_CONNECTION_KEY] = mongoose.createConnection(uri, {
      dbName,
    })

    connections[GLOBAL_CONNECTION_KEY].model(
      'GlobalUsers',
      mongoose.Schema(globalUsersSchema, { timestamps: true })
    )
  }

  return connections[GLOBAL_CONNECTION_KEY].asPromise()
}

export default dbConnectGlobal
