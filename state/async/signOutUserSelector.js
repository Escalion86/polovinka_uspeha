'use client'

import { atom } from 'jotai'

import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
const signOutUserSelector = atom(null, async (get, set, delEventUser) => {
  const { eventId, userId } = delEventUser

  const isLoadedEventId = get(
    isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
  )
  if (isLoadedEventId) {
    const eventUsers = await get(asyncEventsUsersByEventIdAtom(eventId))
    const newEventUsers = eventUsers.filter(
      (eventUser) => eventUser.userId !== userId
    )
    set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
  }

  const isLoadedUserId = get(
    isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId)
  )
  if (isLoadedUserId) {
    const eventsUser = await get(asyncEventsUsersByUserIdAtom(userId))
    const newEventsUser = eventsUser.filter(
      (eventUser) => eventUser.eventId !== eventId
    )

    set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
  }
})

export default signOutUserSelector
