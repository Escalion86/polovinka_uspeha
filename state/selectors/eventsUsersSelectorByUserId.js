import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'

export const eventsUsersSelectorByUserId = selectorFamily({
  key: 'eventsUsersSelectorByUserId',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      return get(eventsUsersAtom).filter((item) => item.userId === id)
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersSelectorByUserId
