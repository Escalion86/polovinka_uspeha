import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('ServicesUsers', req, res, {
    params: { userId: req.query.id },
  })
}
