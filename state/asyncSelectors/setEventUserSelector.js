import { noWait, selector } from 'recoil'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import { getRecoil } from 'recoil-nexus'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import asyncEventsUsersAllAtom from './asyncEventsUsersAllAtom'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'

const setEventUserSelector = selector({
  key: 'setEventUserSelector',
  get: ({ get }) => {
    return undefined
  },
  set: ({ set, get }, updateEventUser) => {
    const { _id, eventId, userId } = updateEventUser

    const isLoadedEventId = getRecoil(
      isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
    )
    if (isLoadedEventId) {
      const eventUsers = get(asyncEventsUsersByEventIdAtom(eventId))
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
    const isLoadedUserId = getRecoil(
      isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId)
    )
    if (isLoadedUserId) {
      const eventsUser = get(asyncEventsUsersByUserIdAtom(userId))
      const updatedEventsUser = eventsUser.map((eventUser) =>
        eventUser._id === _id ? updateEventUser : eventUser
      )
      set(asyncEventsUsersByUserIdAtom(userId), updatedEventsUser)
    }
    // else {
    //   const eventsUser = get(noWait(asyncEventsUsersByUserIdAtom(userId)))
    //   if (eventsUser.state === 'hasValue') {
    //     const updatedEventsUser = eventsUser.contents.map((eventUser) =>
    //       eventUser._id === _id ? updateEventUser : eventUser
    //     )

    //     set(asyncEventsUsersByUserIdAtom(userId), updatedEventsUser)
    //   }
    // }

    const isLoadedEventsUsersAll = getRecoil(
      isLoadedAtom('asyncEventsUsersAllAtom')
    )
    if (isLoadedEventsUsersAll) {
      const eventsUsers = get(asyncEventsUsersAllAtom)
      const updatedEventsUser = eventsUsers.map((eventUser) =>
        eventUser._id === _id ? updateEventUser : eventUser
      )

      set(asyncEventsUsersAllAtom, updatedEventsUser)
    }

    // const eventsUsers = get(noWait(asyncEventsUsersAllSelector))
    // if (eventsUsers.state === 'hasValue') {
    //   const updatedEventsUser = eventsUsers.contents.map((eventUser) =>
    //     eventUser._id === _id ? updateEventUser : eventUser
    //   )

    //   set(asyncEventsUsersAllSelector, updatedEventsUser)
    // }
  },
})

export default setEventUserSelector
