import { selectorFamily } from 'recoil'
import eventAssistantsIdsSelector from './eventAssistantsIdsSelector'
import paymentsWithNoCouponsFromAndToUsersSelector from './paymentsWithNoCouponsFromAndToUsersSelector'

export const sumOfPaymentsToAssistantsSelector = selectorFamily({
  key: 'sumOfPaymentsToAssistantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      const eventAssistants = get(eventAssistantsIdsSelector(id))
      return (
        get(paymentsWithNoCouponsFromAndToUsersSelector(id)).reduce(
          (p, payment) => {
            const isUserAssistant = eventAssistants.includes(payment.userId)
            if (isUserAssistant)
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

export default sumOfPaymentsToAssistantsSelector
