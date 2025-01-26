import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

const paymentsOfEventWithoutEventIdSelector = atom(async (get) => {
  const payments = await get(asyncPaymentsAtom)
  return payments.filter(
    (payment) =>
      (!payment.sector || payment.sector === 'event') &&
      !payment.eventId &&
      !payment.serviceId &&
      !payment.productId
  )
})

export default paymentsOfEventWithoutEventIdSelector
