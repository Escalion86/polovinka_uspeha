import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

const eventAssistantsSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const users = await get(eventsUsersFullByEventIdSelector(id))

    return users
      .filter((item) => item.user && item.status === 'assistant')
      .map((item) => item.user)
  })
)

export default eventAssistantsSelector
