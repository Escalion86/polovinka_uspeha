// const fs = require('fs');
var mongoose = require('mongoose')

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

// // const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0ogkw.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`
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

// const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0ogkw.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`
const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}
// let dbUser = fs.readFileSync(process.env.DB_USER);
// let dbPassword = fs.readFileSync(process.env.DB_PASSWORD);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    console.log('dbConnect: используется текущее соединение')
    // console.log('dbConnect: cached.conn', cached.conn)
    return cached.conn
  }

  if (!cached.promise) {
    console.log('dbConnect: соединяем')
    const opts = {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // bufferCommands: false,
      // useFindAndModify: false,
      dbName: process.env.MONGODB_DBNAME,
    }

    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error: '))
    db.once('open', function () {
      console.log('Connected successfully')
    })

    mongoose.set('strictQuery', false)
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  } else {
    console.log('dbConnect: ожидаем соединения (повторно)')
  }
  cached.conn = await cached.promise
  // console.log('cached.conn.connections[0]', cached.conn.connections[0])
  // autoIncrement.initialize(cached.conn)
  // cached.autoIncrement = autoIncrement
  return cached
}

export default dbConnect
