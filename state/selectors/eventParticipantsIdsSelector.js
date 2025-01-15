import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsSelector from './eventParticipantsSelector'

export const eventParticipantsIdsSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventParticipants = await get(eventParticipantsSelector(id))

    return eventParticipants.map((user) => user._id)
  })
)

export default eventParticipantsIdsSelector
