import { atom } from 'jotai'

import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'
import asyncEventsUsersAllAtom from './asyncEventsUsersAllAtom'

const signUpUserSelector = atom(null, (get, set, newEventUser) => {
  const { eventId, userId } = newEventUser

  const isLoadedEventId = get(
    isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
  )
  if (isLoadedEventId) {
    const eventUsers = get(asyncEventsUsersByEventIdAtom(eventId))
    const newEventUsers = [...eventUsers, newEventUser]
    set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
  }

  const isLoadedUserId = get(
    isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId)
  )
  if (isLoadedUserId) {
    const eventsUser = get(asyncEventsUsersByUserIdAtom(userId))
    const newEventsUser = [...eventsUser, newEventUser]
    set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
  }

  const isLoadedEventsUsersAll = get(isLoadedAtom('asyncEventsUsersAllAtom'))
  if (isLoadedEventsUsersAll) {
    const eventsUsers = get(asyncEventsUsersAllAtom)
    const newEventsUser = [...eventsUsers, newEventUser]

    set(asyncEventsUsersAllAtom, newEventsUser)
  }
})

export default signUpUserSelector
