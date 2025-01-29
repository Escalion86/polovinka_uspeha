'use client'

import { atom } from 'jotai'

import paymentsWithoutUserWritingToEventSelector from './paymentsWithoutUserWritingToEventSelector'

const badgePaymentsWithoutUserWritingToEventSelector = atom(async (get) => {
  const payments = await get(paymentsWithoutUserWritingToEventSelector)
  return payments.length
})

export default badgePaymentsWithoutUserWritingToEventSelector
