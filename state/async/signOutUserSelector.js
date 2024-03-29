import { noWait, selector } from 'recoil'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { getRecoil } from 'recoil-nexus'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'
import asyncEventsUsersAllAtom from './asyncEventsUsersAllAtom'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'

const signOutUserSelector = selector({
  key: 'signOutUserSelector',
  get: ({ get }) => {
    return undefined
  },
  set: ({ set, get }, delEventUser) => {
    const { eventId, userId } = delEventUser

    const isLoadedEventId = getRecoil(
      isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
    )
    if (isLoadedEventId) {
      const eventUsers = get(asyncEventsUsersByEventIdAtom(eventId))
      const newEventUsers = eventUsers.filter(
        (eventUser) => eventUser.userId !== userId
      )
      set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
    }
    //   else {
    //   const eventUsers = get(noWait(asyncEventsUsersByEventIdAtom(eventId)))

    //   if (eventUsers.state === 'hasValue') {
    //     const newEventUsers = eventUsers.contents.filter(
    //       (eventUser) => eventUser.userId !== userId
    //     )
    //     set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
    //   }
    // }

    const isLoadedUserId = getRecoil(
      isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId)
    )
    if (isLoadedUserId) {
      const eventsUser = get(asyncEventsUsersByUserIdAtom(userId))
      const newEventsUser = eventsUser.filter(
        (eventUser) => eventUser.eventId !== eventId
      )

      set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
    }
    // else {
    // const eventsUser = get(noWait(asyncEventsUsersByUserIdAtom(userId)))
    // if (eventsUser.state === 'hasValue') {
    //   const newEventsUser = eventsUser.contents.filter(
    //     (eventUser) => eventUser.eventId !== eventId
    //   )

    //   set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
    // }}

    const isLoadedEventsUsersAll = getRecoil(
      isLoadedAtom('asyncEventsUsersAllAtom')
    )
    if (isLoadedEventsUsersAll) {
      const eventsUsers = get(asyncEventsUsersAllAtom)
      const newEventsUser = eventsUsers.filter(
        (eventUser) =>
          !(eventUser.eventId === eventId && eventUser.userId === userId)
      )

      set(asyncEventsUsersAllAtom, newEventsUser)
    }

    // const eventsUsers = get(noWait(asyncEventsUsersAllSelector))
    // if (eventsUsers.state === 'hasValue') {
    //   const newEventsUser = eventsUsers.contents.filter(
    //     (eventUser) => eventUser.eventId !== eventId
    //   )

    //   set(asyncEventsUsersAllSelector, newEventsUser)
    // }
  },
})

export default signOutUserSelector
