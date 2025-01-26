import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

const eventAssistantsFullByEventIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventUsersFull = await get(eventsUsersFullByEventIdSelector(id))

    return eventUsersFull.filter((item) => item.status === 'assistant')
  })
)

export default eventAssistantsFullByEventIdSelector
