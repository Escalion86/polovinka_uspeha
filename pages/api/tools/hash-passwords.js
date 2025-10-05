import { hashPassword, shouldRehashPassword } from '@helpers/passwordUtils'
import dbConnect from '@utils/dbConnect'
import { LOCATIONS_KEYS } from '@server/serverConstants'

const AUTH_TOKEN = process.env.PASSWORD_MIGRATION_TOKEN

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

      const usersModel = db.model('Users')
      const candidates = await usersModel
        .find({ password: { $nin: [null, ''] } })
        .select({ password: 1 })
        .lean()

      let processed = 0
      let updated = 0

      const operations = []

      for (const candidate of candidates) {
        processed += 1
        if (!shouldRehashPassword(candidate.password)) continue

        const newHash = await hashPassword(candidate.password)
        if (!newHash || newHash === candidate.password) continue

        operations.push({
          updateOne: {
            filter: { _id: candidate._id },
            update: { $set: { password: newHash } },
          },
        })
        updated += 1
      }

      if (operations.length > 0) {
        await usersModel.bulkWrite(operations)
      }

      summary.push({
        location,
        success: true,
        processed,
        updated,
      })
    } catch (error) {
      console.error('password migration error', location, error)
      summary.push({ location, success: false, error: error?.message || 'Unknown error' })
    }
  }

  return res.status(200).json({ success: true, summary })
}
