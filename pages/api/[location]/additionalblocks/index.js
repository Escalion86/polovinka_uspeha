import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('AdditionalBlocks', req, res, { autoIncrementIndex: true })
}
