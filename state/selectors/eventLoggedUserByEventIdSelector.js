import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'

export const eventLoggedUserByEventIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const loggedUser = get(loggedUserActiveAtom)
    if (!loggedUser) return

    const eventsUser = await get(asyncEventsUsersByUserIdAtom(loggedUser._id))
    const eventUser = eventsUser.find(({ eventId }) => eventId === id)

    return eventUser
  })
)

export default eventLoggedUserByEventIdSelector
