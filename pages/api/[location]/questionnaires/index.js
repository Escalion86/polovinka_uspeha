import Questionnaires from '@models/Questionnaires'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Questionnaires, req, res)
}
