import Payments from '@models/Payments'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Payments, req, res)
}
