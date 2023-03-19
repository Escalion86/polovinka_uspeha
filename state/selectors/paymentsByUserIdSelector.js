import { DEFAULT_PAYMENT } from '@helpers/constants'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentsByUserIdSelector = selectorFamily({
  key: 'paymentsByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(paymentsAtom).filter((item) => item.userId === id)
    },
})

export default paymentsByUserIdSelector
