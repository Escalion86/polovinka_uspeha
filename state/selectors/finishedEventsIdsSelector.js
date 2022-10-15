import isEventActive from '@helpers/isEventActive'
import isEventExpired from '@helpers/isEventExpired'
import eventsAtom from '@state/atoms/eventsAtom'
import { selector } from 'recoil'

export const finishedEventsIdsSelector = selector({
  key: 'finishedEventsIdsSelector',
  get: ({ get }) => {
    const events = get(eventsAtom)
    const finishedEvents = events.filter(
      (event) => isEventExpired(event) && isEventActive(event)
    )
    const sortedEvents = [...finishedEvents].sort((a, b) =>
      new Date(a.dateStart) > new Date(b.dateStart) ? 1 : -1
    )

    return sortedEvents.map((event) => event._id)
  },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default finishedEventsIdsSelector
