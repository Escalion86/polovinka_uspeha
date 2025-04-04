import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('EventsUsers', req, res, {
    params: { userId: req.query.id },
  })
}
