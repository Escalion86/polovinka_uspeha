import asyncEventsUsersByEventIdAtom from '@state/asyncSelectors/asyncEventsUsersByEventIdAtom'
import { selectorFamily } from 'recoil'

export const testSelector = selectorFamily({
  key: 'testSelector',
  get:
    (id) =>
    async ({ get }) => {
      const eventsUsers = await get(asyncEventsUsersByEventIdAtom(id))
      return eventsUsers
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default testSelector
