import RemindDates from '@models/RemindDates'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(RemindDates, req, res)
}
