import { selectorFamily } from 'recoil'
import eventParticipantsIdsSelector from './eventParticipantsIdsSelector'
import paymentsWithNoCouponsFromAndToUsersSelector from './paymentsWithNoCouponsFromAndToUsersSelector'

export const sumOfPaymentsFromParticipantsSelector = selectorFamily({
  key: 'sumOfPaymentsFromParticipantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      const eventParticipants = get(eventParticipantsIdsSelector(id))
      return (
        get(paymentsWithNoCouponsFromAndToUsersSelector(id)).reduce(
          (p, payment) => {
            const isUserParticipant = eventParticipants.includes(payment.userId)
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

export default sumOfPaymentsFromParticipantsSelector
