import { atom } from 'jotai'

import isEventActive from '@helpers/isEventActive'
import isEventExpired from '@helpers/isEventExpired'
import eventsAtom from '@state/atoms/eventsAtom'

export const finishedEventsIdsSelector = atom((get) => {
  const events = get(eventsAtom)
  const finishedEvents = events.filter(
    (event) => isEventExpired(event) && isEventActive(event)
  )
  const sortedEvents = [...finishedEvents].sort((a, b) =>
    new Date(a.dateStart) > new Date(b.dateStart) ? 1 : -1
  )

  return sortedEvents.map((event) => event._id)
})

export default finishedEventsIdsSelector
