import { DEFAULT_PAYMENT } from '@helpers/constants'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentsByProductIdSelector = selectorFamily({
  key: 'paymentsByProductIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(paymentsAtom).filter((item) => item.productId === id)
    },
})

export default paymentsByProductIdSelector
