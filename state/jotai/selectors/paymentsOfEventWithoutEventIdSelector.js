import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

export const paymentsOfEventWithoutEventIdSelector = atom((get) => {
  return get(asyncPaymentsAtom).filter(
    (payment) =>
      (!payment.sector || payment.sector === 'event') &&
      !payment.eventId &&
      !payment.serviceId &&
      !payment.productId
  )
})

export default paymentsOfEventWithoutEventIdSelector
