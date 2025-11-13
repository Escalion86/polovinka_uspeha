import buildEventsQueryOptions from '@helpers/buildEventsQueryOptions'
import serializeLeanDoc from '@helpers/serializeLeanDoc'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res
      .status(405)
      .json({ success: false, error: 'Method Not Allowed' })
  }

  const { location, mode, limit, serverNow } = req.query

  if (!location) {
    return res.status(400).json({ success: false, error: 'No location' })
  }

  const db = await dbConnect(location)

  if (!db) {
    return res.status(500).json({ success: false, error: 'db error' })
  }

  const normalizedLimit = Number(limit)
  const parsedLimit = Number.isFinite(normalizedLimit) ? normalizedLimit : undefined
  const referenceDate = serverNow ? new Date(serverNow) : new Date()

  const options = buildEventsQueryOptions(
    { mode: mode ?? 'all', limit: parsedLimit },
    referenceDate
  )

  if (!options) {
    return res.status(200).json({ success: true, data: [] })
  }

  try {
    let query = db
      .model('Events')
      .find(options.filter)
      .select({
        description: 0,
        address: 0,
        images: 0,
        organizerId: 0,
        warning: 0,
        googleCalendarId: 0,
      })

    if (options.sort) {
      query = query.sort(options.sort)
    }

    if (typeof options.limit === 'number') {
      query = query.limit(options.limit)
    }

    const events = await query.lean()
    return res
      .status(200)
      .json({ success: true, data: serializeLeanDoc(events) })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
