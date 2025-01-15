import { getData } from './CRUD'

export const getEventById = async (eventId, location) => {
  const url = `/api/${location}/events/${eventId}`
  const event = await getData(url)
  return event
}
