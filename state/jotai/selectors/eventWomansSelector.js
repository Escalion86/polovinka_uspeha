import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

export const eventWomansSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventParticipantsFullByEventIdSelector(id))
      .filter((item) => item.user?.gender == 'famale')
      .map((item) => item.user)
  })
)

export default eventWomansSelector
