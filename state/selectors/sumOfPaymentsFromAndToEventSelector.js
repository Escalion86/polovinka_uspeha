import { selectorFamily } from 'recoil'
import paymentsFromAndToEventSelector from './paymentsFromAndToEventSelector'

export const sumOfPaymentsFromAndToEventSelector = selectorFamily({
  key: 'sumOfPaymentsFromAndToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(paymentsFromAndToEventSelector(id)).reduce(
          (p, payment) => p - (payment.sum ?? 0),
          0
        ) / 100
      )
    },
})

export default sumOfPaymentsFromAndToEventSelector
