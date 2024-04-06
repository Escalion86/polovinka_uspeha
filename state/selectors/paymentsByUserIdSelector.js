import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selectorFamily } from 'recoil'
// import paymentsOfLoggedUserSelector from './paymentsOfLoggedUserSelector'

export const paymentsByUserIdSelector = selectorFamily({
  key: 'paymentsByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      // if (id === 'all') return get(paymentsOfLoggedUserSelector)
      return get(asyncPaymentsAtom).filter((item) => item.userId === id)
    },
})

export default paymentsByUserIdSelector
