import asyncEventsUsersByUserIdAtom from '@state/asyncSelectors/asyncEventsUsersByUserIdAtom'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'

export const eventsUsersByUserIdSelector = selectorFamily({
  key: 'eventsUsersByUserIdSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return []
      return await get(asyncEventsUsersByUserIdAtom(id))
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

export default eventsUsersByUserIdSelector
