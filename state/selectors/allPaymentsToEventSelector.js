import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const allPaymentsToEventSelector = selectorFamily({
  key: 'allPaymentsToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return get(paymentsByEventIdSelector(id)).filter(
        (payment) => payment.payDirection === 'toEvent'
      )
    },
})

export default allPaymentsToEventSelector
