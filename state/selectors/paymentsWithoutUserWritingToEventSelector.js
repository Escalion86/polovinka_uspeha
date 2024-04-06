import asyncEventsUsersAllSelector from '@state/async/asyncEventsUsersAllSelector'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

import { selector } from 'recoil'

export const paymentsWithoutUserWritingToEventSelector = selector({
  key: 'paymentsWithoutUserWritingToEventSelector',
  get: async ({ get, set }) => {
    const eventUsers = get(asyncEventsUsersAllSelector)

    return get(asyncPaymentsAtom).filter(
      (payment) =>
        (payment.payDirection === 'toUser' ||
          payment.payDirection === 'fromUser') &&
        !!payment.eventId &&
        !eventUsers.find(
          (eventUser) =>
            eventUser.eventId === payment.eventId &&
            eventUser.userId === payment.userId
        )
    )
  },
})

export default paymentsWithoutUserWritingToEventSelector
