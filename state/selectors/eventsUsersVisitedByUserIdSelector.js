import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import finishedEventsIdsSelector from './finishedEventsIdsSelector'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'

const eventsUsersVisitedByUserIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const finishedEvents = get(finishedEventsIdsSelector)
    const eventsUsers = await get(asyncEventsUsersByUserIdAtom(id))
    const filteredEventsUsers = eventsUsers.filter(
      (eventUser) =>
        finishedEvents.includes(eventUser.eventId) &&
        eventUser.status !== 'ban' &&
        eventUser.status !== 'reserve'
    )
    return [...filteredEventsUsers].sort((a, b) =>
      finishedEvents.indexOf(a.eventId) < finishedEvents.indexOf(b.eventId)
        ? -1
        : 1
    )
  })
)

export default eventsUsersVisitedByUserIdSelector
