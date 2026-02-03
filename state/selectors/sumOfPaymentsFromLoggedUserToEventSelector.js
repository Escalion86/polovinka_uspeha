'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import paymentsOfLoggedUserByEventIdSelector from './paymentsOfLoggedUserByEventIdSelector'

const sumOfPaymentsFromLoggedUserToEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsOfLoggedUserByEventIdSelector(id))
    return payments.reduce((p, payment) => p + (payment.sum ?? 0), 0) / 100
  })
)

export default sumOfPaymentsFromLoggedUserToEventSelector

