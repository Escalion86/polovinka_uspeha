'use client'

import { atom } from 'jotai'

import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'

const setEventUserSelector = atom(null, async (get, set, updateEventUser) => {
  const { _id, eventId, userId } = updateEventUser

  const isLoadedEventId = get(
    isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
  )
  if (isLoadedEventId) {
    const eventUsers = await get(asyncEventsUsersByEventIdAtom(eventId))
    const updatedEventUsers = eventUsers.map((eventUser) =>
      eventUser._id === _id ? updateEventUser : eventUser
    )
    set(asyncEventsUsersByEventIdAtom(eventId), updatedEventUsers)
  }
  //   else {
  //   const eventUsers = get(noWait(asyncEventsUsersByEventIdAtom(eventId)))
  //   if (eventUsers.state === 'hasValue') {
  //     const updatedEventUsers = eventUsers.contents.map((eventUser) =>
  //       eventUser._id === _id ? updateEventUser : eventUser
  //     )
  //     set(asyncEventsUsersByEventIdAtom(eventId), updatedEventUsers)
  //   }
  // }
  const isLoadedUserId = get(
    isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId)
  )
  if (isLoadedUserId) {
    const eventsUser = await get(asyncEventsUsersByUserIdAtom(userId))
    const updatedEventsUser = eventsUser.map((eventUser) =>
      eventUser._id === _id ? updateEventUser : eventUser
    )
    set(asyncEventsUsersByUserIdAtom(userId), updatedEventsUser)
  }
})

export default setEventUserSelector
