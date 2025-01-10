import { getData } from './CRUD'

export const getEventById = async (eventId) => {
  const url = `/api/events/${eventId}`
  const event = await getData(url)
  return event
}
