'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

const eventMansSelector = atomFamily((id) =>
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

