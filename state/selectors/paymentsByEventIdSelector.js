import { DEFAULT_PAYMENT } from '@helpers/constants'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selectorFamily } from 'recoil'

export const paymentsByEventIdSelector = selectorFamily({
  key: 'paymentsByEventIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_PAYMENT
      return get(paymentsAtom).filter((item) => item.eventId === id)
    },
})

export default paymentsByEventIdSelector
