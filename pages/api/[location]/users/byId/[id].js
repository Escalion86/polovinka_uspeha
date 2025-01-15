import Users from '@models/Users'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Users, req, res, { _id: req.query.id })
}
