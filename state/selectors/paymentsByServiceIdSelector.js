import { DEFAULT_PAYMENT } from '@helpers/constants'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentsByServiceIdSelector = selectorFamily({
  key: 'paymentsByServiceIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(paymentsAtom).filter((item) => item.serviceId === id)
    },
})

export default paymentsByServiceIdSelector
