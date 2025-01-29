'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByEventIdSelector from './paymentsByEventIdSelector'

const paymentsOfEventFromAndToUsersSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const payments = await get(paymentsByEventIdSelector(id))
    return payments.filter(
      (payment) =>
        payment.payDirection === 'toUser' || payment.payDirection === 'fromUser'
    )
  })
)

export default paymentsOfEventFromAndToUsersSelector
