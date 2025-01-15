import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

export const allPaymentsOfInternalSelector = atom(
  async (get) =>
    await get(asyncPaymentsAtom).filter(
      (payment) => payment.sector === 'internal'
    )
)

export default allPaymentsOfInternalSelector
