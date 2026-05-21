import checkLocationValid from '@server/checkLocationValid'

export default async function handler(req, res) {
  const { query, method, body } = req

  const location = query?.location
  if (!location)
    return res?.status(400).json({ success: false, error: 'No location' })

  if (!checkLocationValid(location))
    return res?.status(400).json({ success: false, error: 'Invalid location' })

  // const db = await dbConnect(location)
  // if (!db) return res?.status(400).json({ success: false, error: 'db error' })

  if (method === 'POST') {
    try {
      delete query.location
      // const { update_id, message, callback_query } = body

      console.log('whatsapp recive message', body)

      return res?.status(200).json({ success: true })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }

  return res?.status(400).json({ success: false, error: 'wrong method' })
}
