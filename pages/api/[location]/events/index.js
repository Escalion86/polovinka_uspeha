import Events from '@models/Events'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Events, req, res)
}
