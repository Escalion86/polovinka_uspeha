import { atom } from 'jotai'

import asyncEventsUsersByUserIdAtom from '@state/jotai/async/asyncEventsUsersByUserIdAtom'
import loggedUserActiveAtom from '@state/jotai/atoms/loggedUserActiveAtom'
import eventSelector from './eventSelector'

export const eventsOfLoggedUserSelector = atom(async (get) => {
  const loggedUser = get(loggedUserActiveAtom)
  if (!loggedUser) return

  const eventsUser = await get(asyncEventsUsersByUserIdAtom(loggedUser._id))
  return eventsUser.map(({ eventId }) => get(eventSelector(eventId)))
})

export default eventsOfLoggedUserSelector
