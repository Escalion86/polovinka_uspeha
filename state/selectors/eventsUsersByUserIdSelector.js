import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'

export const eventsUsersByUserIdSelector = selectorFamily({
  key: 'eventsUsersByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const eventsUsers = get(eventsUsersAtom)
      return eventsUsers ? eventsUsers.filter((item) => item.userId === id) : []
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersByUserIdSelector
