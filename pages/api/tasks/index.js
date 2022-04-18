import Tasks from '@models/Tasks'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Tasks, req, res)
}
