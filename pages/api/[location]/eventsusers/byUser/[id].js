import EventsUsers from '@models/EventsUsers'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(EventsUsers, req, res, { userId: req.query.id })
}
