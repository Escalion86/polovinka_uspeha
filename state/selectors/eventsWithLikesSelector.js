import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import { selector } from 'recoil'

export const eventsWithLikesSelector = selector({
  key: 'eventsWithLikesSelector',
  get: ({ get }) => {
    const eventsWithLikes = get(eventsAtom)
      .filter(({ likes }) => likes)
      .map((event) => {
        const eventUsers = get(asyncEventsUsersByEventIdAtom(event._id))
        return { ...event, usersLikes: eventUsers.map(({ likes }) => likes) }
      })
    return eventsWithLikes
  },
})

export default eventsWithLikesSelector
