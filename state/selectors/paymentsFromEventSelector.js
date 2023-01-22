import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsFromEventSelector = selectorFamily({
  key: 'paymentsFromEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return get(paymentsByEventIdSelector(id)).filter(
        (payment) => payment.payDirection === 'fromEvent'
      )
    },
})

export default paymentsFromEventSelector
