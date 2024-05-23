import { selector } from 'recoil'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import eventSelector from './eventSelector'

export const eventsOfLoggedUserSelector = selector({
  key: 'eventsOfLoggedUserSelector',
  get: async ({ get }) => {
    const loggedUser = get(loggedUserActiveAtom)
    if (!loggedUser) return

    const eventsUser = await get(asyncEventsUsersByUserIdAtom(loggedUser._id))
    return eventsUser.map(({ eventId }) => get(eventSelector(eventId)))
  },
})

export default eventsOfLoggedUserSelector
