import dbConnect from '@utils/dbConnect'
import { LOCATIONS_KEYS } from '@server/serverConstants'
import recalculateAllEventAchievements from '@server/recalculateAllEventAchievements'

const AUTH_TOKEN = process.env.ACHIEVEMENTS_RECALC_TOKEN

const validateToken = (providedToken) => {
  if (!AUTH_TOKEN) return true
  return providedToken === AUTH_TOKEN
}

const resolveLocations = (locationParam) => {
  if (!locationParam) return LOCATIONS_KEYS

  if (Array.isArray(locationParam)) {
    return locationParam.filter((value) => LOCATIONS_KEYS.includes(value))
  }

  return LOCATIONS_KEYS.includes(locationParam) ? [locationParam] : []
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  if (!validateToken(req.query?.token)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  const locations = resolveLocations(req.query?.location)

  if (!locations.length) {
    return res.status(400).json({
      success: false,
      error: 'No valid locations provided',
    })
  }

  const summary = []

  for (const location of locations) {
    try {
      const db = await dbConnect(location)

      if (!db) {
        summary.push({ location, success: false, error: 'DB connection failed' })
        continue
      }

      const result = await recalculateAllEventAchievements(db)

      summary.push({
        location,
        success: true,
        ...result,
      })
    } catch (error) {
      console.error('event achievements recalculation error', location, error)
      summary.push({
        location,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return res.status(200).json({ success: true, summary })
}
