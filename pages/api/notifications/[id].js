import Notifications from '@models/Notifications'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(Notifications, req, res)
}
