import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

const eventParticipantsSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventsUsersFull = await get(eventsUsersFullByEventIdSelector(id))

    return eventsUsersFull
      .filter((item) => item.status === 'participant')
      .map((item) => item.user)
  })
)

export default eventParticipantsSelector
