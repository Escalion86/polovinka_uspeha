import { atom } from 'jotai'

import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'
import asyncEventsUsersAllAtom from './asyncEventsUsersAllAtom'

const signOutUserSelector = atom(null, (get, set, delEventUser) => {
  const { eventId, userId } = delEventUser

  const isLoadedEventId = get(
    isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
  )
  if (isLoadedEventId) {
    const eventUsers = get(asyncEventsUsersByEventIdAtom(eventId))
    const newEventUsers = eventUsers.filter(
      (eventUser) => eventUser.userId !== userId
    )
    set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
  }

  const isLoadedUserId = get(
    isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId)
  )
  if (isLoadedUserId) {
    const eventsUser = get(asyncEventsUsersByUserIdAtom(userId))
    const newEventsUser = eventsUser.filter(
      (eventUser) => eventUser.eventId !== eventId
    )

    set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
  }

  const isLoadedEventsUsersAll = get(isLoadedAtom('asyncEventsUsersAllAtom'))
  if (isLoadedEventsUsersAll) {
    const eventsUsers = get(asyncEventsUsersAllAtom)
    const newEventsUser = eventsUsers.filter(
      (eventUser) =>
        !(eventUser.eventId === eventId && eventUser.userId === userId)
    )

    set(asyncEventsUsersAllAtom, newEventsUser)
  }
})

export default signOutUserSelector
