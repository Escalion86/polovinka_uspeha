'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

const eventMansReserveSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventsUsersFull = await get(eventsUsersFullByEventIdSelector(id))

    return eventsUsersFull
      .filter(
        (item) => item.user?.gender == 'male' && item.status === 'reserve'
      )
      .map((item) => item.user)
  })
)

export default eventMansReserveSelector
