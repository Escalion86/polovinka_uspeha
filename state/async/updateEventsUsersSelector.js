'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import isLoadedAtom from '@state/atoms/isLoadedAtom'
import asyncEventsUsersByEventIdAtom from './asyncEventsUsersByEventIdAtom'
import asyncEventsUsersByUserIdAtom from './asyncEventsUsersByUserIdAtom'

const updateEventsUsersSelector = atomFamily((eventId) =>
  atom(null, async (get, set, updatedEventUsers) => {
    const isLoadedEventId = get(
      isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId)
    )
    if (isLoadedEventId) {
      const eventUsers = await get(asyncEventsUsersByEventIdAtom(eventId))
      // Обновляем записи у пользователей
      const newEventUsers = await Promise.all(
        eventUsers.map(async (eventUser) => {
          const updatedEventUser = updatedEventUsers.find(
            ({ _id }) => eventUser._id === _id
          )
          if (updatedEventUser) {
            const isLoadedUserId = get(
              isLoadedAtom(
                'asyncEventsUsersByUserIdAtom' + updatedEventUser.userId
              )
            )
            if (isLoadedUserId) {
              const eventsUser = await get(
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
      )
      // Заменяем записи у мероприятия
      set(asyncEventsUsersByEventIdAtom(eventId), newEventUsers)

    }
  })
)

export default updateEventsUsersSelector
