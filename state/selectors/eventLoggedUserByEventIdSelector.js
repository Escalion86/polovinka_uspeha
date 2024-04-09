import { selectorFamily } from 'recoil'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

export const eventLoggedUserByEventIdSelector = selectorFamily({
  key: 'eventLoggedUserByEventIdSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return []
      const loggedUser = get(loggedUserAtom)
      if (!loggedUser) return

      const eventsUser = await get(asyncEventsUsersByUserIdAtom(loggedUser._id))
      const eventUser = eventsUser.find(({ eventId }) => eventId === id)

      return eventUser
    },
})

export default eventLoggedUserByEventIdSelector
