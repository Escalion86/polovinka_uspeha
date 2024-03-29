import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { selectorFamily } from 'recoil'
import { getRecoil } from 'recoil-nexus'
import asyncEventsUsersAllAtom from './asyncEventsUsersAllAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'

const updateEventsUsersSelector = selectorFamily({
  key: 'updateEventsUsersSelector',
  set:
    (eventId) =>
    ({ set, get }, updatedEventUsers) => {
      const isLoadedEventId = getRecoil(
        isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
      )
      if (isLoadedEventId) {
        const eventUsers = get(asyncEventsUsersByEventIdAtom(eventId))
        // Обновляем записи у пользователей
        // for (let i = 0; i < eventUsers.length; i++) {
        // const eventUser = eventUsers[i]
        const newEventUsers = eventUsers.map((eventUser) => {
          const updatedEventUser = updatedEventUsers.find(
            ({ _id }) => eventUser._id === _id
          )
          if (updatedEventUser) {
            const isLoadedUserId = getRecoil(
              isLoadedAtom(
                'asyncEventsUsersByUserIdAtom' + updatedEventUser.userId
              )
            )
            if (isLoadedUserId) {
              const eventsUser = get(
                asyncEventsUsersByUserIdAtom(updatedEventUser.userId)
              )
              const updatedEventsUser = eventsUser.map((eventUser) => {
                if (eventUser._id === updatedEventUser._id)
                  return updatedEventUser
                return eventUser
              })
              set(
                asyncEventsUsersByUserIdAtom(eventUser.userId),
                updatedEventsUser
              )
            }

            return updatedEventUser
          }
          return eventUser
        })
        // Заменяем записи у мероприятия
        set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)

        // Обновляем все eventUsers если необходимо
        const isLoadedEventsUsersAll = getRecoil(
          isLoadedAtom('asyncEventsUsersAllAtom')
        )

        if (isLoadedEventsUsersAll) {
          const eventsUsers = get(asyncEventsUsersAllAtom)
          const newEventUsersIds = newEventUsers.map(({ _id }) => _id)
          const cleanedEventsUsers = eventsUsers.filter(
            ({ _id }) => !newEventUsersIds.includes(_id)
          )
          const updatedEventsUsers = [...cleanedEventsUsers, ...newEventUsers]

          set(asyncEventsUsersAllAtom, updatedEventsUsers)
        }
      }
    },
})

export default updateEventsUsersSelector
