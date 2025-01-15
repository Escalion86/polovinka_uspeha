import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

export const paymentsWithoutEventIdSelector = atom(async (get) => {
  const payments = await get(asyncPaymentsAtom)
  return payments.filter((payment) => !payment.eventId)
})

export default paymentsWithoutEventIdSelector
