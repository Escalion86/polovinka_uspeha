import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

const paymentsWithoutEventIdSelector = atom(async (get) => {
  const payments = await get(asyncPaymentsAtom)
  return payments.filter((payment) => !payment.eventId)
})

export default paymentsWithoutEventIdSelector
