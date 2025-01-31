import { DEFAULT_EVENT } from '@helpers/constants'
import checkLocationValid from '@server/checkLocationValid'
import CRUD from '@server/CRUD'
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
  if (method === 'GET') {
    try {
      delete query.location

      const events = await db.model('Events').find({}).lean()
      const updatedEvents = await Promise.all(
        events.map(async (event) => {
          if (event?.duration) {
            const dateStart = event.date ?? new Date()
            const dateEnd = new Date(
              new Date(dateStart).getTime() +
                (event?.duration ?? DEFAULT_EVENT.duration) * 60000
            )
            await db
              .model('Events')
              .findByIdAndUpdate(event._id, {
                dateStart,
                dateEnd,
              })
              .lean()
          }
        })
      ).catch((error) => {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      })
      const eventsUpdated = await db.model('Events').find({}).lean()
      return res?.status(201).json({ success: true, data: eventsUpdated })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }

  return await CRUD('Events', req, res)
}
