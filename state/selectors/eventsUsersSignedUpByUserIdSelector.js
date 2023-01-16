import eventsAtom from '@state/atoms/eventsAtom'
import { selectorFamily } from 'recoil'
import eventsUsersByUserIdSelector from './eventsUsersByUserIdSelector'
import eventsUsersFullByUserIdSelector from './eventsUsersFullByUserIdSelector'

export const eventsUsersSignedUpByUserIdSelector = selectorFamily({
  key: 'eventsUsersSignedUpByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const eventsIds = get(eventsAtom)
        .filter((event) => event.status !== 'canceled')
        .map((event) => event._id)
      const eventsUsers = get(eventsUsersFullByUserIdSelector(id))
      const filteredEventsUsers = eventsUsers.filter(
        (eventUser) =>
          eventsIds.includes(eventUser.eventId) &&
          !['ban', 'reserve'].includes(eventUser.status)
      )
      return [...filteredEventsUsers].sort((a, b) =>
        eventsIds.indexOf(a.eventId) < eventsIds.indexOf(b.eventId) ? -1 : 1
      )
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersSignedUpByUserIdSelector