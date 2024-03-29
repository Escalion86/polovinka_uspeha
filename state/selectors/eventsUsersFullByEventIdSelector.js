import { selectorFamily } from 'recoil'
import eventAtom from '@state/async/eventAtom'
import userSelector from './userSelector'
import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'

export const eventsUsersFullByEventIdSelector = selectorFamily({
  key: 'eventsUsersFullByEventIdSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return []

      const eventsUsers = await get(asyncEventsUsersByEventIdAtom(id))

      return eventsUsers
        ? eventsUsers
            // .filter(
            //   (item) => item.eventId && item.userId && item.eventId === id
            // )
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
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersFullByEventIdSelector
