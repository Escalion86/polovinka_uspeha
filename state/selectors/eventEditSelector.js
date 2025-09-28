'use client'

import { atom } from 'jotai'

import eventSelector from '@state/selectors/eventSelector'
import eventsAtom from '@state/atoms/eventsAtom'
import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import userSelector from './userSelector'
import { RESET } from 'jotai/utils'
import usersAtomAsync from '@state/async/usersAtomAsync'
import isLoadedAtom from '@state/atoms/isLoadedAtom'

const eventEditSelector = atom(null, (get, set, newItem) => {
  const items = get(eventsAtom)
  if (!newItem?._id) return
  const findedItem = items.find((event) => event._id === newItem._id)
  // Если мы обновляем существующий атом
  if (findedItem) {
    const newItemsList = items.map((event) => {
      if (event._id === newItem._id) return newItem
      return event
    })

    // Если мы изменяем status с закрытого на иной или наоборот, то нужно обновить пользователей записанных на это мероприятие
    if (
      findedItem?.status !== newItem?.status &&
      (newItem?.status === 'closed' || findedItem?.status === 'closed')
    ) {
      get(asyncEventsUsersByEventIdAtom(newItem._id)).then(
        async (eventUsers) => {
          const usersIds = eventUsers.map((eventUser) => eventUser.userId)
          // console.log('usersIds', usersIds)
          for (const userId of usersIds) {
            // console.log('userId :>> ', userId)
            set(userSelector(userId), RESET)
          }
        }
      )
      if (get(isLoadedAtom('usersAtomAsync'))) {
        set(usersAtomAsync, RESET)
      }

      if (get(isLoadedAtom('asyncPaymentsAtom'))) {
        set(asyncPaymentsAtom, RESET)
      }
    }

    set(eventSelector(newItem._id), newItem)
    set(eventsAtom, newItemsList)
  } else {
    // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
    set(eventsAtom, [...items, newItem])
  }
})

export default eventEditSelector
