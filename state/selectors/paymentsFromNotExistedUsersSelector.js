'use client'

import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import userSelector from './userSelector'
import locationAtom from '@state/atoms/locationAtom'
import { LOCATIONS_KEYS } from '@server/serverConstants'
import { getData } from '@helpers/CRUD'

const paymentsFromNotExistedUsersSelector = atom(async (get) => {
  const payments = await get(asyncPaymentsAtom)
  const location = get(locationAtom)

  const otherLocations = LOCATIONS_KEYS.filter((loc) => loc !== location)

  const result = []
  for (const payment of payments) {
    if (!!payment.userId && !(await get(userSelector(payment.userId)))) {
      const tempPayment = {
        ...payment,
        user: null,
        event: null,
        location: null,
      }
      // Пробуем найти из какого он региона
      for (const loc in otherLocations) {
        const findedUser = await getData(
          `/api/${loc}/users/${payment.userId}`,
          {},
          null,
          null,
          false
        )
        if (findedUser) {
          tempPayment.user = findedUser
          tempPayment.location = loc
          if (payment.eventId) {
            const findedEvent = await getData(
              `/api/${loc}/events/${payment.eventId}`,
              {},
              null,
              null,
              false
            )
            tempPayment.event = findedEvent
          }
          break
        }
      }
      result.push(tempPayment)
    }
  }

  return result
})

export default paymentsFromNotExistedUsersSelector
