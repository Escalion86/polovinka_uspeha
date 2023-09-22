import { noWait, selector } from 'recoil'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
// import asyncEventsUsersAllSelector from './asyncEventsUsersAllSelector'

const setEventUserSelector = selector({
  key: 'setEventUserSelector',
  get: ({ get }) => {
    return undefined
  },
  set: ({ set, get }, updateEventUser) => {
    const { _id, eventId, userId } = updateEventUser
    const eventUsers = get(noWait(asyncEventsUsersByEventIdAtom(eventId)))

    if (eventUsers.state === 'hasValue') {
      const updatedEventUsers = eventUsers.contents.map((eventUser) =>
        eventUser._id === _id ? updateEventUser : eventUser
      )
      set(asyncEventsUsersByEventIdAtom(eventId), updatedEventUsers)
    }

    const eventsUser = get(noWait(asyncEventsUsersByUserIdAtom(userId)))
    if (eventsUser.state === 'hasValue') {
      const updatedEventsUser = eventsUser.contents.map((eventUser) =>
        eventUser._id === _id ? updateEventUser : eventUser
      )

      set(asyncEventsUsersByUserIdAtom(userId), updatedEventsUser)
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
