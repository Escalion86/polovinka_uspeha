import { noWait, selector } from 'recoil'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'

const signOutUserSelector = selector({
  key: 'signOutUserSelector',
  get: ({ get }) => {
    return undefined
  },
  set: ({ set, get }, delEventUser) => {
    const { eventId, userId } = delEventUser
    const eventUsers = get(noWait(asyncEventsUsersByEventIdAtom(eventId)))

    if (eventUsers.state === 'hasValue') {
      const newEventUsers = eventUsers.contents.filter(
        (eventUser) => eventUser.userId !== userId
      )
      set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)
    }

    const eventsUser = get(noWait(asyncEventsUsersByUserIdAtom(userId)))
    if (eventsUser.state === 'hasValue') {
      const newEventsUser = eventsUser.contents.filter(
        (eventUser) => eventUser.eventId !== eventId
      )

      set(asyncEventsUsersByUserIdAtom(userId), newEventsUser)
    }
  },
})

export default signOutUserSelector
