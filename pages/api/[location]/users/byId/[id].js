import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('Users', req, res, { params: { _id: req.query.id } })
}
