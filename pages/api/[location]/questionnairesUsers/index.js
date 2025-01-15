import QuestionnairesUsers from '@models/QuestionnairesUsers'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(QuestionnairesUsers, req, res)
}
