import { selectorFamily } from 'recoil'
import eventParticipantsIdsSelector from './eventParticipantsIdsSelector'
import paymentsWithNoCouponsOfEventFromAndToUsersSelector from './paymentsWithNoCouponsOfEventFromAndToUsersSelector'

export const sumOfPaymentsOfEventFromParticipantsSelector = selectorFamily({
  key: 'sumOfPaymentsOfEventFromParticipantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(paymentsWithNoCouponsOfEventFromAndToUsersSelector(id)).reduce(
          (p, payment) => {
            const isUserParticipant = get(
              eventParticipantsIdsSelector(id)
            ).includes(payment.userId)
            if (isUserParticipant)
              return (
                p +
                (payment.sum ?? 0) *
                  (payment.payDirection === 'toUser' ? -1 : 1)
              )

            return p
          },
          0
        ) / 100
      )
    },
})

export default sumOfPaymentsOfEventFromParticipantsSelector
