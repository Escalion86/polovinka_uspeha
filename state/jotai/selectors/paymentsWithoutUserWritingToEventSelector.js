import { atom } from 'jotai'

import asyncEventsUsersAllAtom from '@state/jotai/async/asyncEventsUsersAllAtom'
import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

export const paymentsWithoutUserWritingToEventSelector = atom(async (get) => {
  const eventUsers = get(asyncEventsUsersAllAtom)

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
})

export default paymentsWithoutUserWritingToEventSelector
