import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'

export const eventsUsersSelector = selectorFamily({
  key: 'eventsUsersSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      return get(eventsUsersAtom).find((item) => item._id === id)
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersSelector
