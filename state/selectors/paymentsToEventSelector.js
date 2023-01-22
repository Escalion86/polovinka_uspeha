import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsToEventSelector = selectorFamily({
  key: 'paymentsToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return get(paymentsByEventIdSelector(id)).filter(
        (payment) => payment.payDirection === 'toEvent'
      )
    },
})

export default paymentsToEventSelector
