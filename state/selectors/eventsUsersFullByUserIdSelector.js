import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'
import eventSelector from './eventSelector'
import userSelector from './userSelector'

export const eventsUsersFullByUserIdSelector = selectorFamily({
  key: 'eventsUsersFullByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const eventsUsers = get(eventsUsersAtom)

      return eventsUsers
        ? eventsUsers
            .filter((item) => item.eventId && item.userId && item.userId === id)
            .map((item) => {
              const user = get(userSelector(item.userId))
              const event = get(eventSelector(item.eventId))
              return {
                ...item,
                user,
                event,
                // userStatus: item.userStatus ?? user.status,
                // eventSubtypeNum: item.eventSubtypeNum,
                // comment: item.comment,
              }
            })
        : []
    },
})

export default eventsUsersFullByUserIdSelector
