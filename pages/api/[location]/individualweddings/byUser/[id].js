import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('IndividualWeddings', req, res, {
    params: { userId: req.query.id },
  })
}
