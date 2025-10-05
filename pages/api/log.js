import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { method, body } = req

  if (method !== 'POST') {
    return res?.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const location = body?.location
  if (!location) {
    return res?.status(400).json({ success: false, error: 'No location provided' })
  }

  try {
    const db = await dbConnect(location)
    if (!db) {
      return res?.status(400).json({ success: false, error: 'Database connection error' })
    }

    const {
      error = {},
      user,
      userInfo,
      meta,
      context,
    } = body ?? {}

    const logEntry = await db.model('ClientErrorLogs').create({
      message: error?.message ?? '',
      stack: error?.stack ?? '',
      componentStack: error?.componentStack ?? '',
      url: error?.url ?? '',
      userAgent: error?.userAgent ?? '',
      location,
      userInfo: userInfo ?? user ?? error?.user ?? null,
      meta: meta ?? context ?? error?.meta ?? null,
    })

    return res?.status(200).json({
      success: true,
      data: { id: logEntry?._id },
    })
  } catch (error) {
    console.error('Failed to persist client error log', error)
    return res?.status(500).json({ success: false, error: 'Failed to log error' })
  }
}
