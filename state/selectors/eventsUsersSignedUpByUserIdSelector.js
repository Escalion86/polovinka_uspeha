// import asyncEventsUsersByUserIdAtom from '@state/asyncSelectors/asyncEventsUsersByUserIdAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import { selectorFamily } from 'recoil'
import eventsUsersFullByUserIdSelector from './eventsUsersFullByUserIdSelector'

export const eventsUsersSignedUpByUserIdSelector = selectorFamily({
  key: 'eventsUsersSignedUpByUserIdSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return []
      const eventsIds = get(eventsAtom)
        .filter((event) => event.status !== 'canceled')
        .map((event) => event._id)
      const eventsUsers = await get(eventsUsersFullByUserIdSelector(id))
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
