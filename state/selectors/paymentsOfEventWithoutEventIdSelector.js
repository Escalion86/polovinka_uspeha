import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selector } from 'recoil'

export const paymentsOfEventWithoutEventIdSelector = selector({
  key: 'paymentsOfEventWithoutEventIdSelector',
  get: ({ get }) => {
    return get(asyncPaymentsAtom).filter(
      (payment) =>
        (!payment.sector || payment.sector === 'event') &&
        !payment.eventId &&
        !payment.serviceId &&
        !payment.productId
    )
  },
})

export default paymentsOfEventWithoutEventIdSelector
