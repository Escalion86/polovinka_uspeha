import asyncEventsUsersByEventIdAtom from '@state/asyncSelectors/asyncEventsUsersByEventIdAtom'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'

export const eventsUsersByEventIdSelector = selectorFamily({
  key: 'eventsUsersByEventIdSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return []
      return await get(asyncEventsUsersByEventIdAtom(id))
      // return eventsUsers
      //   ? eventsUsers.filter((item) => item.eventId === id)
      //   : []
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersByEventIdSelector
