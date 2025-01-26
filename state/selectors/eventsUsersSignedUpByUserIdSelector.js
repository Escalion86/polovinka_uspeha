import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsAtom from '@state/atoms/eventsAtom'
import eventsUsersFullByUserIdSelector from './eventsUsersFullByUserIdSelector'

const eventsUsersSignedUpByUserIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventsIds = get(eventsAtom)
      .filter((event) => event.status !== 'canceled')
      .map((event) => event._id)
    const eventsUsers = await get(eventsUsersFullByUserIdSelector(id))
    const filteredEventsUsers = eventsUsers.filter(
      (eventUser) =>
        eventsIds.includes(eventUser.eventId) &&
        !['ban', 'reserve'].includes(eventUser.status)
    )
    return [...filteredEventsUsers].sort((a, b) =>
      eventsIds.indexOf(a.eventId) < eventsIds.indexOf(b.eventId) ? -1 : 1
    )
  })
)

export default eventsUsersSignedUpByUserIdSelector
