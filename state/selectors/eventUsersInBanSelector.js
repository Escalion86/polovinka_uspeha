'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

const eventUsersInBanSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    const eventUsersFull = await get(eventsUsersFullByEventIdSelector(id))

    return eventUsersFull
      .filter((item) => item.status === 'ban')
      .map((item) => item.user)
  })
)

export default eventUsersInBanSelector

