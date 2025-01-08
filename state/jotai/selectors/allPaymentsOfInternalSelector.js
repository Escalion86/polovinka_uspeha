import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

export const allPaymentsOfInternalSelector = atom((get) =>
  get(asyncPaymentsAtom).filter((payment) => payment.sector === 'internal')
)

export default allPaymentsOfInternalSelector
