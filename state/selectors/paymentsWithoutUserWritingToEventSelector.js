'use client'

import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import asyncEventsUsersByEventIdAtom from '@state/async/asyncEventsUsersByEventIdAtom'

const paymentsWithoutUserWritingToEventSelector = atom(async (get) => {
  const payments = await get(asyncPaymentsAtom)

  const relevantPayments = payments.filter(
    (payment) =>
      (payment.payDirection === 'toUser' ||
        payment.payDirection === 'fromUser') &&
      !!payment.eventId
  )

  if (relevantPayments.length === 0) return []

  const eventIds = Array.from(
    new Set(relevantPayments.map((payment) => payment.eventId).filter(Boolean))
  )

  const eventUsersMap = new Map()

  await Promise.all(
    eventIds.map(async (eventId) => {
      const eventUsers = await get(asyncEventsUsersByEventIdAtom(eventId))
      eventUsersMap.set(eventId, eventUsers ?? [])
    })
  )

  return relevantPayments.filter(
    (payment) =>
      !(eventUsersMap.get(payment.eventId) ?? []).some(
        (eventUser) => eventUser.userId === payment.userId
      )
  )
})

export default paymentsWithoutUserWritingToEventSelector
