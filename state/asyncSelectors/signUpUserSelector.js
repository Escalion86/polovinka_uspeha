import { noWait, selector } from 'recoil'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'

const signUpUserSelector = selector({
  key: 'signUpUserSelector',
  get: ({ get }) => {
    return undefined
  },
  set: ({ set, get }, newEventUser) => {
    const { eventId, userId } = newEventUser
    const eventUsers = get(noWait(asyncEventsUsersByEventIdAtom(eventId)))

    if (eventUsers.state === 'hasValue') {
      const newEventUsers = [...eventUsers.contents, newEventUser]
      set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
    }

    const eventsUser = get(noWait(asyncEventsUsersByUserIdAtom(userId)))
    if (eventsUser.state === 'hasValue') {
      const newEventsUser = [...eventsUser.contents, newEventUser]
      set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
    }
    // const eventsUsers = get(noWait(asyncEventsUsersAllSelector))
    // if (eventsUsers.state === 'hasValue') {
    //   const newEventsUser = [...eventsUsers.contents, newEventUser]
    //   set(asyncEventsUsersAllSelector, newEventsUser)
    // }
  },
})

export default signUpUserSelector
