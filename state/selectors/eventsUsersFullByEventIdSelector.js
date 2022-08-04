import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'
import userSelector from './userSelector'

export const eventsUsersFullByEventIdSelector = selectorFamily({
  key: 'eventsUsersFullByEventIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const eventsUsers = get(eventsUsersAtom)

      return eventsUsers
        ? eventsUsers
            .filter(
              (item) => item.eventId && item.userId && item.eventId === id
            )
            .map((item) => {
              return { ...item, user: get(userSelector(item.userId)) }
            })
        : []
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersFullByEventIdSelector
