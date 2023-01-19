import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsOfEventToEventSelector = selectorFamily({
  key: 'paymentsOfEventToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(paymentsByEventIdSelector(id)).filter(
        (payment) => payment.payDirection === 'toEvent'
      )
    },
})

export default paymentsOfEventToEventSelector
