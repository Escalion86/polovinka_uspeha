'use client'

import { atom } from 'jotai'

import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import eventsAtom from '@state/atoms/eventsAtom'

const eventsWithLikesSelector = atom(async (get) => {
  const eventsWithLikes = get(eventsAtom).filter(({ likes }) => likes)

  const preparedEventsWithLikes = await Promise.all(
    eventsWithLikes.map(async (event) => {
      const eventUsers = await get(asyncEventsUsersByEventIdAtom(event._id))
      return { ...event, usersLikes: eventUsers.map(({ likes }) => likes) }
    })
  )
  return preparedEventsWithLikes
})

export default eventsWithLikesSelector
