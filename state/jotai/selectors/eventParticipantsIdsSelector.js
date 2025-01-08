import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsSelector from './eventParticipantsSelector'

export const eventParticipantsIdsSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventParticipantsSelector(id)).map((user) => user._id)
  })
)

export default eventParticipantsIdsSelector
