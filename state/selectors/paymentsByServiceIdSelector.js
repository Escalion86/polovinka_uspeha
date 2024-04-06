import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentsByServiceIdSelector = selectorFamily({
  key: 'paymentsByServiceIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(asyncPaymentsAtom).filter((item) => item.serviceId === id)
    },
})

export default paymentsByServiceIdSelector
