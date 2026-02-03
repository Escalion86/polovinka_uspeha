'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import paymentsByProductIdSelector from './paymentsByProductIdSelector'

const paymentsFromAndToProductSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const payments = await get(paymentsByProductIdSelector(id))
    return payments.filter(
      (payment) =>
        payment.payDirection === 'toProduct' ||
        payment.payDirection === 'fromProduct'
    )
  })
)

export default paymentsFromAndToProductSelector

