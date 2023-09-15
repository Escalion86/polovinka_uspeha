import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req
  if (method === 'GET') {
    if (query.test) {
      await dbConnect()
      const users = await Users.updateMany({}, { interests: '' })
      return users
    }
  }
  // return await CRUD(Users, req, res)
}
