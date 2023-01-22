import { selectorFamily } from 'recoil'
import paymentsFromEventSelector from './paymentsFromEventSelector'

export const sumOfPaymentsFromEventSelector = selectorFamily({
  key: 'sumOfPaymentsToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(paymentsFromEventSelector(id)).reduce(
          (p, payment) => p + (payment.sum ?? 0),
          0
        ) / 100
      )
    },
})

export default sumOfPaymentsFromEventSelector
