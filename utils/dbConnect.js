// const fs = require('fs');
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

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
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  autoIncrement.initialize(cached.conn)
  cached.autoIncrement = autoIncrement
  return cached
}

export default dbConnect
