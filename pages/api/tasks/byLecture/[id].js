import Tasks from '@models/Tasks'
import CRUD from '@server/CRUD'
import { deleteLectureAndHisBranch } from '@server/massCRUD'

export default async function handler(req, res) {
  if (method === 'DELETE') {
    return await deleteLectureAndHisBranch(query?.id, res, true)
  } else return await CRUD(Tasks, req, res, { lectureId: req.query.id })
}
