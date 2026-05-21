import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('AiPrompts', req, res)
}
