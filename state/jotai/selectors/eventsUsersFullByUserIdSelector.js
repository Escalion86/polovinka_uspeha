import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import userSelector from './userSelector'
import asyncEventsUsersByUserIdAtom from '@state/jotai/async/asyncEventsUsersByUserIdAtom'
import eventSelector from './eventSelector'

export const eventsUsersFullByUserIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    const eventsUsers = await get(asyncEventsUsersByUserIdAtom(id))

    return eventsUsers
      ? eventsUsers
          // .filter((item) => item.eventId && item.userId && item.userId === id)
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
  })
)

export default eventsUsersFullByUserIdSelector
