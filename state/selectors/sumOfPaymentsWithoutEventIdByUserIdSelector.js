import { selectorFamily } from 'recoil'
import paymentsWithoutEventIdByUserIdSelector from './paymentsWithoutEventIdByUserIdSelector'

export const sumOfPaymentsWithoutEventIdByUserIdSelector = selectorFamily({
  key: 'sumOfPaymentsWithoutEventIdByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(paymentsWithoutEventIdByUserIdSelector(id)).reduce(
          (p, payment) => p + (payment.sum ?? 0),
          0
        ) / 100
      )
    },
})

export default sumOfPaymentsWithoutEventIdByUserIdSelector
