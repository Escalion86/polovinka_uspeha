import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

export const eventParticipantsFullWithoutRelationshipByEventIdSelector =
  atomFamily((id) =>
    atom((get) => {
      if (!id) return []

      return get(eventParticipantsFullByEventIdSelector(id)).filter(
        (item) => !item.user?.relationship
      )
    })
  )

export default eventParticipantsFullWithoutRelationshipByEventIdSelector
