import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

export const allPaymentsOfInternalSelector = atom(async (get) => {
  const payments = await get(asyncPaymentsAtom)
  return payments.filter((payment) => payment.sector === 'internal')
})

export default allPaymentsOfInternalSelector
