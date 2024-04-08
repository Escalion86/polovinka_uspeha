import asyncServicesUsersAtom from '@state/async/asyncServicesUsersAtom'
import { selectorFamily } from 'recoil'

export const servicesUsersSelector = selectorFamily({
  key: 'servicesUsersSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      return get(asyncServicesUsersAtom).find((item) => item._id === id)
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default servicesUsersSelector
