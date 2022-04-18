import Reviews from '@models/Reviews'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Reviews, req, res)
}
