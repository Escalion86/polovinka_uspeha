import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

export const eventMansSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventParticipantsFullByEventIdSelector(id))
      .filter((item) => item.user?.gender == 'male')
      .map((item) => item.user)
  })
)

export default eventMansSelector
