import mongoose from 'mongoose'

import additionalBlocksSchema from '@schemas/additionalBlocksSchema'
import directionsSchema from '@schemas/directionsSchema'
import eventsSchema from '@schemas/eventsSchema'
import eventsUsersSchema from '@schemas/eventsUsersSchema'
import historiesSchema from '@schemas/historiesSchema'
import loginHistorySchema from '@schemas/loginHistorySchema'
import paymentsSchema from '@schemas/paymentsSchema'
import phoneConfirmsSchema from '@schemas/phoneConfirmsSchema'
import productsSchema from '@schemas/productsSchema'
import questionnairesSchema from '@schemas/questionnairesSchema'
import questionnairesUsersSchema from '@schemas/questionnairesUsersSchema'
import remindDatesSchema from '@schemas/remindDatesSchema'
import reviewsSchema from '@schemas/reviewsSchema'
import rolesSchema from '@schemas/rolesSchema'
import servicesSchema from '@schemas/servicesSchema'
import servicesUsersSchema from '@schemas/servicesUsersSchema'
import siteSettingsSchema from '@schemas/siteSettingsSchema'
import testSchema from '@schemas/testSchema'
import toolsTemplatesSchema from '@schemas/toolsTemplatesSchema'
import usersSchema from '@schemas/usersSchema'
import checkLocationValid from '@server/checkLocationValid'

// var tunnel = require('tunnel-ssh')

// var globalTunnel = require('global-tunnel')
// globalTunnel.initialize({
//   host: '185.185.70.20',
//   port: 27017,
//   // sockets: 50 // optional pool size for each http and https
// })
// // const autoIncrement = require('mongoose-auto-increment')

// var config = {
//   username: 'root',
//   password: 'Magister86',
//   host: '185.185.70.20',
//   port: 22,
//   // agent : process.env.SSH_AUTH_SOCK,
//   // privateKey:require('fs').readFileSync('/Users/myusername/.ssh/id_rsa'),

//   // dstHost: 'localhost',
//   dstPort: 27017,
//   // localHost: '127.0.0.1',

//   // localPort: 27017,
// }

// // const MONGODB_URI = process.env.MONGODB_URI
// // if (!MONGODB_URI) {
// //   throw new Error(
// //     'Please define the MONGODB_URI environment variable inside .env.local'
// //   )
// // }

// // let dbUser = fs.readFileSync(process.env.DB_USER);
// // let dbPassword = fs.readFileSync(process.env.DB_PASSWORD);

// /**
//  * Global is used here to maintain a cached connection across hot reloads
//  * in development. This prevents connections growing exponentially
//  * during API Route usage.
//  */
// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

// async function dbConnect() {
//   try {
//     if (cached.conn) {
//       console.log('dbConnect: используется текущее соединение')
//       // console.log('dbConnect: cached.conn', cached.conn)
//       return cached.conn
//     }

//     if (!cached.promise) {
//       console.log('dbConnect: соединяем')
//       const opts = {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         bufferCommands: false,
//         // useFindAndModify: false,
//       }

//       // const db = mongoose.connection
//       // db.on('error', console.error.bind(console, 'connection error: '))
//       // db.once('open', function () {
//       //   console.log('Connected successfully')
//       // })

//       var server = tunnel(config, function (error, server) {
//         if (error) {
//           console.log('SSH connection error: ' + error)
//         }
//         cached.promise = mongoose
//           .connect('mongodb://127.0.0.1:27017', opts)
//           .then((mongoose) => {
//             return mongoose
//           })

//         var db = mongoose.connection
//         db.on('error', console.error.bind(console, 'DB connection error:'))
//         db.once('open', function () {
//           // we're connected!
//           console.log('DB connection successful')
//           // console.log(server);
//         })
//       })

//       // cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       //   return mongoose
//       // })
//     } else {
//       console.log('dbConnect: ожидаем соединения (повторно)')
//     }
//     cached.conn = await cached.promise
//     // console.log('cached.conn.connections[0]', cached.conn.connections[0])
//     // autoIncrement.initialize(cached.conn)
//     // cached.autoIncrement = autoIncrement
//     return cached
//   } catch (error) {
//     console.log(error)
//   }
// }

// export default dbConnect

// // const fs = require('fs');
// const mongoose = require('mongoose')
// // const autoIncrement = require('mongoose-auto-increment')

// const MONGODB_URI = process.env.MONGODB_URI
// if (!MONGODB_URI) {
//   throw new Error(
//     'Please define the MONGODB_URI environment variable inside .env.local'
//   )
// }
// let dbUser = fs.readFileSync(process.env.DB_USER);
// let dbPassword = fs.readFileSync(process.env.DB_PASSWORD);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null, test: 0 }
// }

// let prevDbConnection

let connections = global.mongoose

if (!connections) {
  connections = global.mongoose = {}
}

// let test = global.test

// if (!test) {
//   test = global.test = {}
// }

async function dbConnect(location) {
  if (!checkLocationValid(location)) {
    console.log('invalid location (dbConnect)', location)
    return
  }

  var dbName
  if (location === 'krsk') dbName = process.env.MONGODB_KRSK_DBNAME
  if (location === 'nrsk') dbName = process.env.MONGODB_NRSK_DBNAME
  if (location === 'ekb') dbName = process.env.MONGODB_EKB_DBNAME

  if (!connections[location]) {
    console.log('')
    console.log('------------------------------')
    console.log('dbConnect: создаем соединение', location)
    console.log('')
    connections[location] = mongoose.createConnection(process.env.MONGODB_URI, {
      dbName,
    })
    connections[location].model(
      'Users',
      mongoose.Schema(usersSchema, { timestamps: true })
    )
    connections[location].model(
      'Events',
      mongoose.Schema(eventsSchema, { timestamps: true })
    )
    connections[location].model(
      'Histories',
      mongoose.Schema(historiesSchema, { timestamps: true })
    )
    connections[location].model(
      'AdditionalBlocks',
      mongoose.Schema(additionalBlocksSchema, { timestamps: true })
    )
    connections[location].model(
      'Directions',
      mongoose.Schema(directionsSchema, { timestamps: true })
    )
    connections[location].model(
      'EventsUsers',
      mongoose.Schema(eventsUsersSchema, { timestamps: true })
    )
    connections[location].model(
      'LoginHistory',
      mongoose.Schema(loginHistorySchema, { timestamps: true })
    )
    connections[location].model(
      'Payments',
      mongoose.Schema(paymentsSchema, { timestamps: true })
    )
    connections[location].model(
      'PhoneConfirms',
      mongoose.Schema(phoneConfirmsSchema, { timestamps: true })
    )
    connections[location].model(
      'Products',
      mongoose.Schema(productsSchema, { timestamps: true })
    )
    connections[location].model(
      'Questionnaires',
      mongoose.Schema(questionnairesSchema, { timestamps: true })
    )
    connections[location].model(
      'QuestionnairesUsers',
      mongoose.Schema(questionnairesUsersSchema, { timestamps: true })
    )
    connections[location].model(
      'RemindDates',
      mongoose.Schema(remindDatesSchema, { timestamps: true })
    )
    connections[location].model(
      'Reviews',
      mongoose.Schema(reviewsSchema, { timestamps: true })
    )
    connections[location].model(
      'Roles',
      mongoose.Schema(rolesSchema, { timestamps: true })
    )
    connections[location].model(
      'Services',
      mongoose.Schema(servicesSchema, { timestamps: true })
    )
    connections[location].model(
      'ServicesUsers',
      mongoose.Schema(servicesUsersSchema, { timestamps: true })
    )
    connections[location].model(
      'SiteSettings',
      mongoose.Schema(siteSettingsSchema)
    )
    connections[location].model(
      'Test',
      mongoose.Schema(testSchema, { timestamps: true })
    )
    connections[location].model(
      'ToolsTemplates',
      mongoose.Schema(toolsTemplatesSchema, { timestamps: true })
    )
  }

  // test[location] = (test[location] ?? 0) + 1

  // console.log('connections :>> ', Object.keys(connections))
  // console.log('test :>> ', test)

  return connections[location].asPromise()

  // // if (prevDbConnection && prevDbConnection !== dbName) {
  // //   console.log('location changed (dbConnect)')
  // //   cached = { conn: null, promise: null }
  // //   await mongoose.disconnect()
  // // }

  // // if (prevDbConnection !== dbName) {
  // //   prevDbConnection = dbName
  // // }
  // // console.log('cached :>> ', cached)
  // // cached.test = (cached.test ?? 0) + 1
  // // console.log('cached.test :>> ', cached.test)

  // if (cached.conn) {
  //   // console.log('dbConnect: используется текущее соединение')
  //   // console.log('dbConnect: cached.conn', cached.conn)
  //   return cached.conn
  // }

  // if (!cached.promise) {
  //   // console.log('dbConnect: соединяем')
  //   // const opts = {
  //   //   // useNewUrlParser: true,
  //   //   // useUnifiedTopology: true,
  //   //   // bufferCommands: false,
  //   //   // useFindAndModify: false,
  //   //   dbName,
  //   // }

  //   const db = mongoose.connection
  //   db.on('error', console.error.bind(console, 'connection error: '))
  //   db.once('open', function () {
  //     console.log('Connected successfully')
  //   })

  //   mongoose.set('strictQuery', false)
  //   cached.promise = mongoose
  //     .connect(process.env.MONGODB_URI, opts)
  //     .then((mongoose) => {
  //       return mongoose
  //     })
  // } else {
  //   console.log('dbConnect: ожидаем соединения (повторно)')
  // }
  // cached.conn = await cached.promise
  // // console.log('cached.conn.connections[0]', cached.conn.connections[0])
  // // autoIncrement.initialize(cached.conn)
  // // cached.autoIncrement = autoIncrement
  // return cached
}

export default dbConnect
