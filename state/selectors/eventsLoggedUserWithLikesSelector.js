import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import { selector } from 'recoil'
import eventsOfLoggedUserSelector from './eventsOfLoggedUserSelector'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import isEventActive from '@helpers/isEventActive'
import isEventStartedOrExpired from '@helpers/isEventStartedOrExpired'

export const eventsLoggedUserWithLikesSelector = selector({
  key: 'eventsLoggedUserWithLikesSelector',
  get: ({ get }) => {
    const loggedUser = get(loggedUserActiveAtom)
    const eventsOfLoggedUser = get(eventsOfLoggedUserSelector)
    const activeAndStartedEventsOfLoggedUser = eventsOfLoggedUser.filter(
      (event) => isEventStartedOrExpired(event) && isEventActive(event)
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
  },
})

export default eventsLoggedUserWithLikesSelector
