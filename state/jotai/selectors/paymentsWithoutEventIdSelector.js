import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

export const paymentsWithoutEventIdSelector = atom((get) => {
  return get(asyncPaymentsAtom).filter((payment) => !payment.eventId)
})

export default paymentsWithoutEventIdSelector
