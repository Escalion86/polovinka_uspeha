import { noWait, selector } from 'recoil'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import { getRecoil } from 'recoil-nexus'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'
import asyncEventsUsersAllAtom from './asyncEventsUsersAllAtom'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'

const signUpUserSelector = selector({
  key: 'signUpUserSelector',
  get: ({ get }) => {
    return undefined
  },
  set: ({ set, get }, newEventUser) => {
    const { eventId, userId } = newEventUser

    // const test = getRecoil(asyncEventsUsersByEventIdAtom(eventId))
    // console.log('test :>> ', test)
    const isLoadedEventId = getRecoil(
      isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
    )
    if (isLoadedEventId) {
      const eventUsers = get(asyncEventsUsersByEventIdAtom(eventId))
      const newEventUsers = [...eventUsers, newEventUser]
      set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
    }
    // else {
    //   const eventUsers = get(noWait(asyncEventsUsersByEventIdAtom(eventId)))

    // if (eventUsers.state === 'hasValue') {
    //   const newEventUsers = [...eventUsers.contents, newEventUser]
    //   set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
    // }
    const isLoadedUserId = getRecoil(
      isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId)
    )
    if (isLoadedUserId) {
      const eventsUser = get(asyncEventsUsersByUserIdAtom(userId))
      const newEventsUser = [...eventsUser, newEventUser]
      set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
    }
    //   else {

    //   const eventsUser = get(noWait(asyncEventsUsersByUserIdAtom(userId)))
    //   if (eventsUser.state === 'hasValue') {
    //     const newEventsUser = [...eventsUser.contents, newEventUser]
    //     set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
    //   }
    //   // const eventsUsers = get(noWait(asyncEventsUsersAllSelector))
    //   // if (eventsUsers.state === 'hasValue') {
    //   //   const newEventsUser = [...eventsUsers.contents, newEventUser]
    //   //   set(asyncEventsUsersAllSelector, newEventsUser)
    //   // }
    // }

    const isLoadedEventsUsersAll = getRecoil(
      isLoadedAtom('asyncEventsUsersAllAtom')
    )
    if (isLoadedEventsUsersAll) {
      const eventsUsers = get(asyncEventsUsersAllAtom)
      const newEventsUser = [...eventsUsers, newEventUser]

      set(asyncEventsUsersAllAtom, newEventsUser)
    }
  },
})

export default signUpUserSelector
