import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { selectorFamily } from 'recoil'
import { getRecoil } from 'recoil-nexus'
import asyncEventsUsersAllAtom from './asyncEventsUsersAllAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'

const setEventsUsersSelector = selectorFamily({
  key: 'setEventsUsersSelector',
  set:
    (eventId) =>
    ({ set, get }, newEventsUsers) => {
      const isLoadedEventId = getRecoil(
        isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
      )
      if (isLoadedEventId) {
        const oldEventUsers = get(asyncEventsUsersByEventIdAtom(eventId))
        // Сначала заменяем записи у мероприятия
        set(asyncEventsUsersByEventIdAtom(eventId), newEventsUsers)
        // Удаляем старые записи у пользователей
        for (let i = 0; i < oldEventUsers.length; i++) {
          const oldEventUser = oldEventUsers[i]
          const isLoadedUserId = getRecoil(
            isLoadedAtom('asyncEventsUsersByUserIdAtom' + oldEventUser.userId)
          )

          if (isLoadedUserId) {
            const eventsUser = get(
              asyncEventsUsersByUserIdAtom(oldEventUser.userId)
            )
            const newEventsUser = eventsUser.filter(
              (eventUser) => eventUser.eventId !== eventId
            )
            set(
              asyncEventsUsersByUserIdAtom(oldEventUser.userId),
              newEventsUser
            )
          }
          //   else {
          //   const eventsUser = get(
          //     noWait(asyncEventsUsersByUserIdAtom(oldEventUser.userId))
          //   )
          //   if (eventsUser.state === 'hasValue') {
          //     const newEventsUser = eventsUser.contents.filter(
          //       (eventUser) => eventUser.eventId === eventId
          //     )
          //     set(
          //       asyncEventsUsersByUserIdAtom(oldEventUser.userId),
          //       newEventsUser
          //     )
          //   }
          // }
        }
        // Вносим новые записи у пользователей
        for (let i = 0; i < newEventsUsers.length; i++) {
          const newEventUser = newEventsUsers[i]
          const isLoadedUserId = getRecoil(
            isLoadedAtom('asyncEventsUsersByUserIdAtom' + newEventUser.userId)
          )
          // console.log(
          //   'isLoadedUserId newEventUser :>> ',
          //   isLoadedUserId,
          //   newEventUser.userId
          // )
          if (isLoadedUserId) {
            const eventsUser = get(
              asyncEventsUsersByUserIdAtom(newEventUser.userId)
            )
            const newEventsUser = [...eventsUser, newEventUser]
            set(
              asyncEventsUsersByUserIdAtom(newEventUser.userId),
              newEventsUser
            )
          }
          // else {
          // const eventsUser = get(
          //   noWait(asyncEventsUsersByUserIdAtom(newEventUser.userId))
          // )
          // if (eventsUser.state === 'hasValue') {
          //   const newEventsUser = [...eventsUser.contents, newEventUser]
          //   set(asyncEventsUsersByUserIdAtom(newEventUser.userId), newEventsUser)
          // }
        }
        // Также обновляем все eventUsers если необходимо
        const isLoadedEventsUsersAll = getRecoil(
          isLoadedAtom('asyncEventsUsersAllAtom')
        )

        if (isLoadedEventsUsersAll) {
          const eventsUsers = get(asyncEventsUsersAllAtom)
          const oldEventUsersIds = oldEventUsers.map(({ _id }) => _id)
          const cleanedEventsUsers = eventsUsers.filter(
            ({ _id }) => !oldEventUsersIds.includes(_id)
          )
          const updatedEventsUsers = [...cleanedEventsUsers, ...newEventsUsers]

          set(asyncEventsUsersAllAtom, updatedEventsUsers)
        }
      }
      //   else {
      //   const oldEventUsers = get(noWait(asyncEventsUsersByEventIdAtom(eventId)))
      //   // Сначала заменяем записи у мероприятия
      //   set(asyncEventsUsersByEventIdAtom(eventId), newEventsUsers)
      //   // Удаляем старые записи у пользователей
      //   if (oldEventUsers.state === 'hasValue') {
      //     for (let i = 0; i < oldEventUsers.contents.length; i++) {
      //       const oldEventUser = oldEventUsers.contents[i]
      //       const eventsUser = get(
      //         noWait(asyncEventsUsersByUserIdAtom(oldEventUser.userId))
      //       )
      //       if (eventsUser.state === 'hasValue') {
      //         const newEventsUser = eventsUser.contents.filter(
      //           (eventUser) => eventUser.eventId === eventId
      //         )
      //         set(
      //           asyncEventsUsersByUserIdAtom(oldEventUser.userId),
      //           newEventsUser
      //         )
      //       }
      //     }
      //   }
      //   // Вносим новые записи у пользователей
      //   for (let i = 0; i < newEventsUsers.length; i++) {
      //     const newEventUser = newEventsUsers[i]
      //     const eventsUser = get(
      //       noWait(asyncEventsUsersByUserIdAtom(newEventUser.userId))
      //     )
      //     if (eventsUser.state === 'hasValue') {
      //       const newEventsUser = [...eventsUser.contents, newEventUser]
      //       set(asyncEventsUsersByUserIdAtom(newEventUser.userId), newEventsUser)
      //     }
      //   }
      // }

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
