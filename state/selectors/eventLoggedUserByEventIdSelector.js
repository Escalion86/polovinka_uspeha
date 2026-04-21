'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'

const eventLoggedUserByEventIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const loggedUser = get(loggedUserActiveAtom)
    if (!loggedUser) return

    const eventsUserRaw = await get(asyncEventsUsersByUserIdAtom(loggedUser._id))
    const eventsUser = Array.isArray(eventsUserRaw)
      ? eventsUserRaw
      : Array.isArray(eventsUserRaw?.data)
        ? eventsUserRaw.data
        : []
    const eventUser = eventsUser.find(({ eventId }) => eventId === id)

    return eventUser
  })
)

export default eventLoggedUserByEventIdSelector

