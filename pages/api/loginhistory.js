import LoginHistory from '@models/LoginHistory'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  await dbConnect()
  if (method === 'POST') {
    try {
      const { userId, browser } = body
      const newLoginHistory = await LoginHistory.create({
        userId,
        browser,
      })

      return res?.status(201).json({ success: true, data: newLoginHistory })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  if (method === 'GET') {
    try {
      const { userId } = query
      const loginHistories = await LoginHistory.find({
        userId,
      })

      return res?.status(201).json({ success: true, data: loginHistories })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  return await CRUD(LoginHistory, req, res)
}
