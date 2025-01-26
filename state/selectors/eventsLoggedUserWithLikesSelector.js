import { atom } from 'jotai'

import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import eventsOfLoggedUserSelector from './eventsOfLoggedUserSelector'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import isEventStartedOrExpired from '@helpers/isEventStartedOrExpired'
import isEventCanceled from '@helpers/isEventCanceled'

const eventsLoggedUserWithLikesSelector = atom(async (get) => {
  const loggedUser = get(loggedUserActiveAtom)
  const eventsOfLoggedUser = await get(eventsOfLoggedUserSelector)
  const activeAndStartedEventsOfLoggedUser = eventsOfLoggedUser.filter(
    (event) => isEventStartedOrExpired(event) && !isEventCanceled(event)
  )
  const eventsWithLikes = activeAndStartedEventsOfLoggedUser.filter(
    (event) => event?.likes
  )

  const eventsWithLikesWithEventsUsers = await Promise.all(
    eventsWithLikes.map(async (event) => {
      const eventUsers = await get(asyncEventsUsersByEventIdAtom(event._id))
      const eventLoggedUser = eventUsers.find(
        (eventUser) => eventUser.userId === loggedUser._id
      )
      if (eventLoggedUser.status !== 'participant') return undefined
      if (!loggedUser.relationship) return { ...event, eventUsers }
      if (eventLoggedUser?.likes) return { ...event, eventUsers }
      return undefined
    })
  )
  return eventsWithLikesWithEventsUsers.filter((event) => event)
})

export default eventsLoggedUserWithLikesSelector
