'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

const eventParticipantsFullWithoutRelationshipByEventIdSelector = atomFamily(
  (id) =>
    atom(async (get) => {
      if (!id) return []
      const eventParticipantsFull = await get(
        eventParticipantsFullByEventIdSelector(id)
      )
      return eventParticipantsFull.filter((item) => !item.user?.relationship)
    })
)

export default eventParticipantsFullWithoutRelationshipByEventIdSelector

