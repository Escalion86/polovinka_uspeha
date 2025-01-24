import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import userSelector from './userSelector'
import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import eventSelector from './eventSelector'

export const eventsUsersFullByEventIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    const eventsUsers = await get(asyncEventsUsersByEventIdAtom(id))

    if (!eventsUsers) return []

    const eventsUsersFull = await Promise.all(
      eventsUsers.map(async (item) => {
        const user = await get(userSelector(item.userId))
        const event = await get(eventSelector(item.eventId))
        return {
          ...item,
          user,
          event,
        }
      })
    )

    return eventsUsersFull
  })
)

export default eventsUsersFullByEventIdSelector
