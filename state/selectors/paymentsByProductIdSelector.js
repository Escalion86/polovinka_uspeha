import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentsByProductIdSelector = selectorFamily({
  key: 'paymentsByProductIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(asyncPaymentsAtom).filter((item) => item.productId === id)
    },
})

export default paymentsByProductIdSelector
