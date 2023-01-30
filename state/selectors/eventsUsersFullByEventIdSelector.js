import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'
import eventSelector from './eventSelector'
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
              const user = get(userSelector(item.userId))
              const event = get(eventSelector(item.eventId))
              return {
                ...item,
                user: { ...user, status: item.userStatus ?? user.status },
                event,
              }
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
