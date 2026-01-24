'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import paymentsByEventIdSelector from './paymentsByEventIdSelector'

const paymentsFromAndToEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const payments = await get(paymentsByEventIdSelector(id))
    return payments.filter(
      (payment) =>
        payment.payDirection === 'toEvent' ||
        payment.payDirection === 'fromEvent'
    )
  })
)

export default paymentsFromAndToEventSelector

