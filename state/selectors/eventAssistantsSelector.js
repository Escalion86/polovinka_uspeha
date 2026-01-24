'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

const eventAssistantsSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const users = await get(eventsUsersFullByEventIdSelector(id))

    return users
      .filter((item) => item.user && item.status === 'assistant')
      .map((item) => item.user)
  })
)

export default eventAssistantsSelector

