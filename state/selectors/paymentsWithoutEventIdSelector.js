import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'

export const paymentsWithoutEventIdSelector = selector({
  key: 'paymentsWithoutEventIdSelector',
  get: ({ get }) => {
    return get(paymentsAtom).filter((payment) => !payment.eventId)
  },
})

export default paymentsWithoutEventIdSelector
