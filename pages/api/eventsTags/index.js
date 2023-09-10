import EventsTags from '@models/EventsTags'
import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD(EventsTags, req, res)
}
