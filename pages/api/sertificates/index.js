import Sertificates from '@models/Sertificates'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Sertificates, req, res)
}
