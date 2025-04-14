'use client'

import { atom } from 'jotai'

import userSelector from './userSelector'
import eventSelector from './eventSelector'
import asyncEventsUsersAllAtom from '@state/async/asyncEventsUsersAllAtom'

const eventsUsersFullAllSelector = atom(async (get) => {
  const eventsUsers = await get(asyncEventsUsersAllAtom)

  if (!eventsUsers) return []

  const eventsUsersFull = await Promise.all(
    eventsUsers.map(async (item) => {
      const user = await get(userSelector(item.userId))
      const event = await get(eventSelector(item.eventId))
      return {
        ...item,
        user,
        event,
      }
    })
  )

  return eventsUsersFull
})

export default eventsUsersFullAllSelector
