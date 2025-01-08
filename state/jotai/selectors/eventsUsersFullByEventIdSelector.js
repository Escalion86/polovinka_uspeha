import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import userSelector from './userSelector'
import asyncEventsUsersByEventIdAtom from '@state/jotai/async/asyncEventsUsersByEventIdAtom'
import eventSelector from './eventSelector'

export const eventsUsersFullByEventIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    const eventsUsers = await get(asyncEventsUsersByEventIdAtom(id))

    return eventsUsers
      ? eventsUsers.map((item) => {
          const user = get(userSelector(item.userId))
          const event = get(eventSelector(item.eventId))
          return {
            ...item,
            user,
            event,
          }
        })
      : []
  })
)

export default eventsUsersFullByEventIdSelector
