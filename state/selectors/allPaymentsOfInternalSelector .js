import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'

export const allPaymentsOfInternalSelector = selector({
  key: 'allPaymentsOfInternalSelector ',
  get: ({ get }) =>
    get(paymentsAtom).filter((payment) => payment.sector === 'internal'),
})

export default allPaymentsOfInternalSelector
