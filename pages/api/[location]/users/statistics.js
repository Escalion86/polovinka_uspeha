import checkLocationValid from '@server/checkLocationValid'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { method, query } = req
  const location = query?.location

  if (!location) {
    return res?.status(400).json({ success: false, error: 'No location' })
  }

  if (!checkLocationValid(location)) {
    return res
      ?.status(400)
      .json({ success: false, error: 'Invalid location' })
  }

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res
      ?.status(405)
      .json({ success: false, error: `Method ${method} Not Allowed` })
  }

  try {
    const db = await dbConnect(location)
    if (!db) {
      return res?.status(500).json({ success: false, error: 'db error' })
    }

    const users = await db
      .model('Users')
      .find({}, {
        firstName: 1,
        secondName: 1,
        thirdName: 1,
        gender: 1,
        status: 1,
        relationship: 1,
        createdAt: 1,
        birthday: 1,
        security: 1,
      })
      .lean({ getters: false, virtuals: false })

    return res?.status(200).json({ success: true, data: users })
  } catch (error) {
    console.error('Failed to fetch users statistics data', error)
    return res
      ?.status(500)
      .json({ success: false, error: 'Failed to load users statistics data' })
  }
}
