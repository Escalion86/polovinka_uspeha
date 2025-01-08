import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selector } from 'recoil'

export const allPaymentsOfInternalSelector = selector({
  key: 'allPaymentsOfInternalSelector ',
  get: ({ get }) =>
    get(asyncPaymentsAtom).filter((payment) => payment.sector === 'internal'),
})

export default allPaymentsOfInternalSelector
