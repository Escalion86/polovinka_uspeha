import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'
import asyncEventsUsersAllAtom from './asyncEventsUsersAllAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'

const setEventsUsersSelector = atomFamily((eventId) =>
  atom(null, (get, set, newEventsUsers) => {
    const isLoadedEventId = get(
      isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
    )
    if (isLoadedEventId) {
      const oldEventUsers = get(asyncEventsUsersByEventIdAtom(eventId))
      // Сначала заменяем записи у мероприятия
      set(asyncEventsUsersByEventIdAtom(eventId), newEventsUsers)
      // Удаляем старые записи у пользователей
      for (let i = 0; i < oldEventUsers.length; i++) {
        const oldEventUser = oldEventUsers[i]
        const isLoadedUserId = get(
          isLoadedAtom('asyncEventsUsersByUserIdAtom' + oldEventUser.userId)
        )

        if (isLoadedUserId) {
          const eventsUser = get(
            asyncEventsUsersByUserIdAtom(oldEventUser.userId)
          )
          const newEventsUser = eventsUser.filter(
            (eventUser) => eventUser.eventId !== eventId
          )
          set(asyncEventsUsersByUserIdAtom(oldEventUser.userId), newEventsUser)
        }
      }
      // Вносим новые записи у пользователей
      for (let i = 0; i < newEventsUsers.length; i++) {
        const newEventUser = newEventsUsers[i]
        const isLoadedUserId = get(
          isLoadedAtom('asyncEventsUsersByUserIdAtom' + newEventUser.userId)
        )
        if (isLoadedUserId) {
          const eventsUser = get(
            asyncEventsUsersByUserIdAtom(newEventUser.userId)
          )
          const newEventsUser = [...eventsUser, newEventUser]
          set(asyncEventsUsersByUserIdAtom(newEventUser.userId), newEventsUser)
        }
      }
      // Также обновляем все eventUsers если необходимо
      const isLoadedEventsUsersAll = get(
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
  })
)

export default setEventsUsersSelector
