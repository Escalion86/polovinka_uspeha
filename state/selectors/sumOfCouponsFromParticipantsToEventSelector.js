import { selectorFamily } from 'recoil'
import couponsOfEventFromUsersSelector from './couponsOfEventFromUsersSelector'
import eventParticipantsIdsSelector from './eventParticipantsIdsSelector'

export const sumOfCouponsFromParticipantsToEventSelector = selectorFamily({
  key: 'sumOfCouponsFromParticipantsToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(couponsOfEventFromUsersSelector(id)).reduce((p, payment) => {
          const isUserParticipant = get(
            eventParticipantsIdsSelector(id)
          ).includes(payment.userId)
          if (isUserParticipant)
            return (
              p +
              (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
            )

          return p
        }, 0) / 100
      )
    },
})

export default sumOfCouponsFromParticipantsToEventSelector
