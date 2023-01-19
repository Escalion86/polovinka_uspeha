import { selectorFamily } from 'recoil'
import eventAssistantsIdsSelector from './eventAssistantsIdsSelector'
import paymentsWithNoCouponsOfEventFromAndToUsersSelector from './paymentsWithNoCouponsOfEventFromAndToUsersSelector'

export const sumOfPaymentsOfEventToAssistantsSelector = selectorFamily({
  key: 'sumOfPaymentsOfEventToAssistantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(paymentsWithNoCouponsOfEventFromAndToUsersSelector(id)).reduce(
          (p, payment) => {
            const isUserAssistant = get(
              eventAssistantsIdsSelector(id)
            ).includes(payment.userId)
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

export default sumOfPaymentsOfEventToAssistantsSelector
