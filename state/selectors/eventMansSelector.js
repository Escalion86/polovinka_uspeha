import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

export const eventMansSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventParticipants = await get(
      eventParticipantsFullByEventIdSelector(id)
    )
    return eventParticipants
      .filter((item) => item.user?.gender == 'male')
      .map((item) => item.user)
  })
)

export default eventMansSelector
