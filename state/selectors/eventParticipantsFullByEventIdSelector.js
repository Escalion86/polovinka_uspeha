import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventParticipantsFullByEventIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventUsersFull = await get(eventsUsersFullByEventIdSelector(id))

    return eventUsersFull.filter((item) => item.status === 'participant')
  })
)

export default eventParticipantsFullByEventIdSelector
