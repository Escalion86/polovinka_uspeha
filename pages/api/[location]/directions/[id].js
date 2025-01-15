import Directions from '@models/Directions'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Directions, req, res)
}
