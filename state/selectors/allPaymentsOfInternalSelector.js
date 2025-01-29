'use client'

import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

const allPaymentsOfInternalSelector = atom(async (get) => {
  const payments = await get(asyncPaymentsAtom)
  return payments.filter((payment) => payment.sector === 'internal')
})

export default allPaymentsOfInternalSelector
