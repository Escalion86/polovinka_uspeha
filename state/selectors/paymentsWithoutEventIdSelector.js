import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selector } from 'recoil'

export const paymentsWithoutEventIdSelector = selector({
  key: 'paymentsWithoutEventIdSelector',
  get: ({ get }) => {
    return get(asyncPaymentsAtom).filter((payment) => !payment.eventId)
  },
})

export default paymentsWithoutEventIdSelector
