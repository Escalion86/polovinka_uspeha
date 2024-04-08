import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentsByEventIdSelector = selectorFamily({
  key: 'paymentsByEventIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(asyncPaymentsAtom).filter((item) => item.eventId === id)
    },
})

export default paymentsByEventIdSelector
