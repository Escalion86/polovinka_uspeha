import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('ProductsUsers', req, res, {
    params: { productId: req.query.id },
  })
}
