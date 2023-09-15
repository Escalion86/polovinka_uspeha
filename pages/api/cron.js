import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
// const schedule = require('node-schedule')

export default async function handler(req, res) {
  const { query, method, body } = req
  if (method === 'GET') {
    if (query.start) {
      console.log('START CRON!!')

      // const job = schedule.scheduleJob('/1 * * * *', function () {
      //   console.log('The answer to life, the universe, and everything!')
      // })
      // await dbConnect()
      // const users = await Users.updateMany({}, { interests: '' })
      // return users
    }
  }
  // return await CRUD(Users, req, res)
}
