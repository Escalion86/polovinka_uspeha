import { atom } from 'jotai'

import asyncEventsUsersByEventIdAtom from '@state/jotai/async/asyncEventsUsersByEventIdAtom'
import eventsAtom from '@state/jotai/atoms/eventsAtom'

export const eventsWithLikesSelector = atom((get) => {
  const eventsWithLikes = get(eventsAtom)
    .filter(({ likes }) => likes)
    .map((event) => {
      const eventUsers = get(asyncEventsUsersByEventIdAtom(event._id))
      return { ...event, usersLikes: eventUsers.map(({ likes }) => likes) }
    })
  return eventsWithLikes
})

export default eventsWithLikesSelector
