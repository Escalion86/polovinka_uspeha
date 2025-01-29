'use client'

import { atom } from 'jotai'

import paymentsWithoutEventIdSelector from './paymentsWithoutEventIdSelector'

const badgePaymentsWithoutEventIdSelector = atom(async (get) => {
  const payments = await get(paymentsWithoutEventIdSelector)
  return payments.length
})

export default badgePaymentsWithoutEventIdSelector
