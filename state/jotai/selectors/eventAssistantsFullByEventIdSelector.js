import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventAssistantsFullByEventIdSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventsUsersFullByEventIdSelector(id)).filter(
      (item) => item.status === 'assistant'
    )
  })
)

export default eventAssistantsFullByEventIdSelector
