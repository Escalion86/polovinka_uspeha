import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventParticipantsFullByEventIdSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventsUsersFullByEventIdSelector(id)).filter(
      (item) => item.status === 'participant'
    )
  })
)

export default eventParticipantsFullByEventIdSelector
