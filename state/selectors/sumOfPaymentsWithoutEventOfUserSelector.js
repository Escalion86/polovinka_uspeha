import { selectorFamily } from 'recoil'
import paymentsWithoutEventOfUserSelector from './paymentsWithoutEventOfUserSelector'

export const sumOfPaymentsWithoutEventOfUserSelector = selectorFamily({
  key: 'sumOfPaymentsWithoutEventOfUserSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(paymentsWithoutEventOfUserSelector(id)).reduce(
          (p, payment) => p + (payment.sum ?? 0),
          0
        ) / 100
      )
    },
})

export default sumOfPaymentsWithoutEventOfUserSelector
