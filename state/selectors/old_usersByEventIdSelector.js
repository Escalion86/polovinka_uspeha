import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'
import userSelector from './userSelector'

export const usersByEventIdSelector = selectorFamily({
  key: 'usersByEventIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const eventsUsers = get(eventsUsersAtom)
      if (!eventsUsers) return []
      return eventsUsers
        .filter((item) => item.eventId === id)
        .map((item) => get(userSelector(item.userId)))
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default usersByEventIdSelector
