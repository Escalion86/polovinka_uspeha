import Events from '@models/Events'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req
  if (method === 'GET') {
    if (query.test) {
      await dbConnect()
      const users = await Users.updateMany(
        { interests: { $ne: '' } },
        { interests: '' }
      )
      const events = await Events.updateMany(
        {
          dateStart: { $lt: new Date(2023, 0, 1) },
          status: 'active',
        },
        { status: 'closed' }
      )
      return { users, events }
    }
  }
  // return await CRUD(Users, req, res)
}
