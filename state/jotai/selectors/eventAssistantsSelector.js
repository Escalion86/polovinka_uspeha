import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventAssistantsSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventsUsersFullByEventIdSelector(id))
      .filter((item) => item.user && item.status === 'assistant')
      .map((item) => item.user)
  })
)

export default eventAssistantsSelector
