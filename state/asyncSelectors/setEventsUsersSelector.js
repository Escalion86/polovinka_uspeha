import { noWait, selectorFamily } from 'recoil'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'

const setEventsUsersSelector = selectorFamily({
  key: 'setEventsUsersSelector',
  set:
    (eventId) =>
    ({ set, get }, newEventsUsers) => {
      const oldEventUsers = get(noWait(asyncEventsUsersByEventIdAtom(eventId)))
      // Сначала заменяем записи у мероприятия
      set(asyncEventsUsersByEventIdAtom(eventId), newEventsUsers)
      // Удаляем старые записи у пользователей
      if (oldEventUsers.state === 'hasValue') {
        for (let i = 0; i < oldEventUsers.contents.length; i++) {
          const oldEventUser = oldEventUsers.contents[i]
          const eventsUser = get(
            noWait(asyncEventsUsersByUserIdAtom(oldEventUser.userId))
          )
          if (eventsUser.state === 'hasValue') {
            const newEventsUser = eventsUser.contents.filter(
              (eventUser) => eventUser.eventId === eventId
            )
            set(
              asyncEventsUsersByUserIdAtom(oldEventUser.userId),
              newEventsUser
            )
          }
        }
      }
      // Вносим новые записи у пользователей
      for (let i = 0; i < newEventsUsers.length; i++) {
        const newEventUser = newEventsUsers[i]
        const eventsUser = get(
          noWait(asyncEventsUsersByUserIdAtom(newEventUser.userId))
        )
        if (eventsUser.state === 'hasValue') {
          const newEventsUser = [...eventsUser.contents, newEventUser]
          set(asyncEventsUsersByUserIdAtom(newEventUser.userId), newEventsUser)
        }
      }

      // TODO
      // Также обновляем все eventUsers если необходимо
      // const eventsUsers = get(noWait(asyncEventsUsersAllAtom))
      // if (eventsUsers.state === 'hasValue') {
      //   const updatedEventsUser = eventsUsers.contents.map((eventUser) =>
      //     eventUser._id === _id ? updateEventUser : eventUser
      //   )

      //   set(asyncEventsUsersAllAtom, updatedEventsUser)
      // }
    },
})

export default setEventsUsersSelector
