import { atom } from 'jotai'

import asyncEventsUsersByEventIdAtom from '@state/jotai/async/asyncEventsUsersByEventIdAtom'
import eventsOfLoggedUserSelector from './eventsOfLoggedUserSelector'
import loggedUserActiveAtom from '@state/jotai/atoms/loggedUserActiveAtom'
import isEventStartedOrExpired from '@helpers/isEventStartedOrExpired'
import isEventCanceled from '@helpers/isEventCanceled'

export const eventsLoggedUserWithLikesSelector = atom((get) => {
  const loggedUser = get(loggedUserActiveAtom)
  const eventsOfLoggedUser = get(eventsOfLoggedUserSelector)
  const activeAndStartedEventsOfLoggedUser = eventsOfLoggedUser.filter(
    (event) => isEventStartedOrExpired(event) && !isEventCanceled(event)
  )
  const eventsWithLikes = activeAndStartedEventsOfLoggedUser.filter(
    (event) => event?.likes
  )
  const eventsWithLikesWithEventsUsers = eventsWithLikes.map((event) => {
    const eventUsers = get(asyncEventsUsersByEventIdAtom(event._id))
    const eventLoggedUser = eventUsers.find(
      (eventUser) => eventUser.userId === loggedUser._id
    )
    if (eventLoggedUser.status !== 'participant') return undefined
    if (!loggedUser.relationship) return { ...event, eventUsers }
    if (eventLoggedUser?.likes) return { ...event, eventUsers }
    return undefined
  })
  return eventsWithLikesWithEventsUsers.filter((event) => event)
})

export default eventsLoggedUserWithLikesSelector
