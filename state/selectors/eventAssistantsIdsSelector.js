'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import eventAssistantsSelector from './eventAssistantsSelector'

const eventAssistantsIdsSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventAssistant = await get(eventAssistantsSelector(id))

    return eventAssistant.map((user) => user._id)
  })
)

export default eventAssistantsIdsSelector

