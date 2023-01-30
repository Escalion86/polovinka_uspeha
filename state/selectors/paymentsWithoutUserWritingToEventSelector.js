import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'

export const paymentsWithoutUserWritingToEventSelector = selector({
  key: 'paymentsWithoutUserWritingToEventSelector',
  get: ({ get }) => {
    const eventUsers = get(eventsUsersAtom)
    return get(paymentsAtom).filter(
      (payment) =>
        (payment.payDirection === 'toUser' ||
          payment.payDirection === 'fromUser') &&
        !eventUsers.find(
          (eventUser) =>
            eventUser.eventId === payment.eventId &&
            eventUser.userId === payment.userId
        )
    )
  },
})

export default paymentsWithoutUserWritingToEventSelector
