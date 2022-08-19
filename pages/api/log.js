export default async function handler(req, res) {
  const { method, body } = req
  console.log(`----------------- log -----------------`)
  console.log(`body`, body)
  console.log(`----------------- end log -----------------`)
  return res?.status(200).json({ success: true, data: { method, body } })
}
