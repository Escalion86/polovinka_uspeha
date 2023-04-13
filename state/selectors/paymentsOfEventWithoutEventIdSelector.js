import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'

export const paymentsOfEventWithoutEventIdSelector = selector({
  key: 'paymentsOfEventWithoutEventIdSelector',
  get: ({ get }) => {
    return get(paymentsAtom).filter(
      (payment) =>
        (!payment.sector || payment.sector === 'event') &&
        !payment.eventId &&
        !payment.serviceId &&
        !payment.productId
    )
  },
})

export default paymentsOfEventWithoutEventIdSelector
