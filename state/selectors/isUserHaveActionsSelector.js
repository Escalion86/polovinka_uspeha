import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import { selectorFamily } from 'recoil'

const isUserHaveActionsSelector = selectorFamily({
  key: 'isUserHaveActionsSelector',
  get:
    (id) =>
    async ({ get }) => {
      const eventsOfUser = await get(asyncEventsUsersByUserIdAtom(id))
      return eventsOfUser.length > 0
    },
})

export default isUserHaveActionsSelector
