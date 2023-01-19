import { selectorFamily } from 'recoil'
import allPaymentsToEventSelector from './allPaymentsToEventSelector'
import eventAssistantsSelector from './eventAssistantsSelector'
import paymentsWithNoCouponsOfEventFromAndToUsersSelector from './paymentsWithNoCouponsOfEventFromAndToUsersSelector'

export const sumOfPaymentsToEventSelector = selectorFamily({
  key: 'sumOfPaymentsToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(allPaymentsToEventSelector(id)).reduce(
          (p, payment) => p - (payment.sum ?? 0),
          0
        ) / 100
      )
    },
})

export default sumOfPaymentsToEventSelector
