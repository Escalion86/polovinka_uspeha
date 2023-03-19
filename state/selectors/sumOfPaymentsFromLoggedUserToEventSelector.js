import { selectorFamily } from 'recoil'
import paymentsFromLoggedUserByEventIdSelector from './paymentsFromLoggedUserByEventIdSelector'

export const sumOfPaymentsFromLoggedUserToEventSelector = selectorFamily({
  key: 'sumOfPaymentsFromLoggedUserToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return (
        get(paymentsFromLoggedUserByEventIdSelector(id)).reduce(
          (p, payment) => p + (payment.sum ?? 0),
          0
        ) / 100
      )
    },
})

export default sumOfPaymentsFromLoggedUserToEventSelector
