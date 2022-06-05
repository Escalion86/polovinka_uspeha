import { DEFAULT_PAYMENT } from '@helpers/constants'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentSelector = selectorFamily({
  key: 'paymentSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(paymentsAtom).find((item) => item._id === id)
    },
})

export default paymentSelector
