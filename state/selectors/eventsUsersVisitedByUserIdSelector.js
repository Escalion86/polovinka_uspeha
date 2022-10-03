import { selectorFamily } from 'recoil'
import eventsUsersByUserIdSelector from './eventsUsersByUserIdSelector'
import finishedEventsIdsSelector from './finishedEventsIdsSelector'

export const eventsUsersVisitedByUserIdSelector = selectorFamily({
  key: 'eventsUsersVisitedByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const finishedEvents = get(finishedEventsIdsSelector)
      const eventsUsers = get(eventsUsersByUserIdSelector(id))
      const filteredEventsUsers = eventsUsers.filter(
        (eventUser) =>
          finishedEvents.includes(eventUser.eventId) &&
          eventUser.status !== 'ban' &&
          eventUser.status !== 'reserve'
      )
      return [...filteredEventsUsers].sort((a, b) =>
        finishedEvents.indexOf(a.eventId) < finishedEvents.indexOf(b.eventId)
          ? -1
          : 1
      )
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersVisitedByUserIdSelector
