import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  const db = await dbConnect(location)
  if (!db) return res?.status(400).json({ success: false, error: 'db error' })
  if (method === 'POST') {
    try {
      delete query.location

      const { userId, browser } = body
      const newLoginHistory = await db.model('LoginHistory').create({
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
      delete query.location

      const { userId } = query
      const loginHistories = await db.model('LoginHistory').find({
        userId,
      })

      return res?.status(201).json({ success: true, data: loginHistories })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }
  return await CRUD('LoginHistory', req, res)
}
