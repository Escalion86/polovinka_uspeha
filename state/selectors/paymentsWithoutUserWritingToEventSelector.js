'use client'

import { atom } from 'jotai'

import asyncEventsUsersAllAtom from '@state/async/asyncEventsUsersAllAtom'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

const paymentsWithoutUserWritingToEventSelector = atom(async (get) => {
  const eventUsers = await get(asyncEventsUsersAllAtom)
  const payments = await get(asyncPaymentsAtom)

  return payments.filter(
    (payment) =>
      (payment.payDirection === 'toUser' ||
        payment.payDirection === 'fromUser') &&
      !!payment.eventId &&
      !eventUsers.find(
        (eventUser) =>
          eventUser.eventId === payment.eventId &&
          eventUser.userId === payment.userId
      )
  )
})

export default paymentsWithoutUserWritingToEventSelector
