'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

const paymentsOfEventWithNoCouponsFromAndToUsersSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const payments = await get(paymentsOfEventFromAndToUsersSelector(id))
    return payments.filter((payment) => payment.payType !== 'coupon')
  })
)

export default paymentsOfEventWithNoCouponsFromAndToUsersSelector
