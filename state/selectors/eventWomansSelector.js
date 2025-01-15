import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

export const eventWomansSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventParticipantsFull = await get(
      eventParticipantsFullByEventIdSelector(id)
    )

    return eventParticipantsFull
      .filter((item) => item.user?.gender == 'famale')
      .map((item) => item.user)
  })
)

export default eventWomansSelector
