'use client'

import { atom } from 'jotai'

import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'

const signUpUserSelector = atom(null, async (get, set, newEventUser) => {
  const { eventId, userId } = newEventUser

  const isLoadedEventId = get(
    isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
  )
  if (isLoadedEventId) {
    const eventUsers = await get(asyncEventsUsersByEventIdAtom(eventId))
    const newEventUsers = [...eventUsers, newEventUser]
    set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
  }

  const isLoadedUserId = get(
    isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId)
  )
  if (isLoadedUserId) {
    const eventsUser = await get(asyncEventsUsersByUserIdAtom(userId))
    const newEventsUser = [...eventsUser, newEventUser]
    set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
  }
})

export default signUpUserSelector
