import Tasks from '@models/Tasks'
import CRUD from '@server/CRUD'
import { deleteTaskAndHisAnswers } from '@server/massCRUD'

export default async function handler(req, res) {
  const { query, method } = req

  if (method === 'DELETE') {
    return await deleteTaskAndHisAnswers(query?.id, res)
  } else return await CRUD(Tasks, req, res)
}
