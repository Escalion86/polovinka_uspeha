'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import paymentsByServiceIdSelector from './paymentsByServiceIdSelector'

const paymentsFromAndToServiceSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const payments = await get(paymentsByServiceIdSelector(id))
    return payments.filter(
      (payment) =>
        payment.payDirection === 'toService' ||
        payment.payDirection === 'fromService'
    )
  })
)

export default paymentsFromAndToServiceSelector

