import { DEFAULT_EVENT } from '@helpers/constants'
import Events from '@models/Events'
import CRUD from '@server/CRUD'
import dbConnect from '@utils/dbConnect'

export default async function handler(req, res) {
  const { query, method, body } = req

  await dbConnect()
  if (method === 'GET') {
    try {
      const events = await Events.find({})
      const updatedEvents = await Promise.all(
        events.map(async (event) => {
          if (event?.duration) {
            const dateStart = event.date ?? new Date()
            const dateEnd = new Date(
              new Date(dateStart).getTime() +
                (event?.duration ?? DEFAULT_EVENT.duration) * 60000
            )
            await Events.findByIdAndUpdate(event._id, { dateStart, dateEnd })
          }
        })
      ).catch((error) => {
        console.log(error)
        return res?.status(400).json({ success: false, error })
      })
      const eventsUpdated = await Events.find({})
      return res?.status(201).json({ success: true, data: eventsUpdated })
    } catch (error) {
      console.log(error)
      return res?.status(400).json({ success: false, error })
    }
  }

  return await CRUD(Events, req, res)
}
