import { selectorFamily } from 'recoil'
import eventAtom from '@state/async/eventAtom'
import userSelector from './userSelector'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'

export const eventsUsersFullByUserIdSelector = selectorFamily({
  key: 'eventsUsersFullByUserIdSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return []

      const eventsUsers = await get(asyncEventsUsersByUserIdAtom(id))

      return eventsUsers
        ? eventsUsers
            // .filter((item) => item.eventId && item.userId && item.userId === id)
            .map((item) => {
              const user = get(userSelector(item.userId))
              const event = get(eventAtom(item.eventId))
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
