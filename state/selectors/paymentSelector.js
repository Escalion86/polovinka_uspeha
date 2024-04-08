import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentSelector = selectorFamily({
  key: 'paymentSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(asyncPaymentsAtom).find((item) => item._id === id)
    },
})

export default paymentSelector
