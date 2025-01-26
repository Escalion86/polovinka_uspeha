import { atom } from 'jotai'

import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import eventSelector from './eventSelector'

const eventsOfLoggedUserSelector = atom(async (get) => {
  const loggedUser = get(loggedUserActiveAtom)
  if (!loggedUser) return

  const eventsUser = await get(asyncEventsUsersByUserIdAtom(loggedUser._id))
  const result = await Promise.all(
    eventsUser.map(async ({ eventId }) => await get(eventSelector(eventId)))
  )
  return result
})

export default eventsOfLoggedUserSelector
