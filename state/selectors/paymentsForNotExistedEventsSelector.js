'use client'

import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import eventSelector from './eventSelector'
import locationAtom from '@state/atoms/locationAtom'
import { LOCATIONS_KEYS } from '@server/serverConstants'
import { getData } from '@helpers/CRUD'

const paymentsForNotExistedEventsSelector = atom(async (get) => {
  const payments = await get(asyncPaymentsAtom)
  const location = get(locationAtom)

  const otherLocations = LOCATIONS_KEYS.filter((loc) => loc !== location)

  const result = []
  for (const payment of payments) {
    if (!!payment.eventId && !(await get(eventSelector(payment.eventId)))) {
      const tempPayment = {
        ...payment,
        user: null,
        event: null,
        location: null,
      }
      // Пробуем найти из какого он региона
      for (const loc in otherLocations) {
        const findedEvent = await getData(
          `/api/${loc}/events/${payment.eventId}`,
          {},
          null,
          null,
          false
        )
        if (findedEvent) {
          tempPayment.user = findedEvent
          tempPayment.location = loc
          if (payment.userId) {
            const findedUser = await getData(
              `/api/${loc}/users/${payment.userId}`,
              {},
              null,
              null,
              false
            )
            tempPayment.user = findedUser
          }
          break
        }
      }
      result.push(tempPayment)
    }
  }

  return result
})

export default paymentsForNotExistedEventsSelector
