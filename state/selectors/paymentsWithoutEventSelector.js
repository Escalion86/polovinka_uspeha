import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'

export const paymentsWithoutEventSelector = selector({
  key: 'paymentsWithoutEventSelector',
  get: ({ get }) => {
    return get(paymentsAtom).filter((payment) => !payment.eventId)
  },
})

export default paymentsWithoutEventSelector
