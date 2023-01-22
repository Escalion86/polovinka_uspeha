import { selectorFamily } from 'recoil'
import paymentsToEventSelector from './paymentsToEventSelector'

export const sumOfPaymentsToEventSelector = selectorFamily({
  key: 'sumOfPaymentsToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(paymentsToEventSelector(id)).reduce(
          (p, payment) => p - (payment.sum ?? 0),
          0
        ) / 100
      )
    },
})

export default sumOfPaymentsToEventSelector
