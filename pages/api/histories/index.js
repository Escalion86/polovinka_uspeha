import Histories from '@models/Histories'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Histories, req, res)
}
