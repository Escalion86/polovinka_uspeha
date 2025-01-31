import CRUD from '@server/CRUD'

export default async function handler(req, res) {
  return await CRUD('ToolsTemplates', req, res)
}
