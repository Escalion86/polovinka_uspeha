import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsFromAndToEventSelector = selectorFamily({
  key: 'paymentsFromAndToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(paymentsByEventIdSelector(id)).filter(
        (payment) =>
          payment.payDirection === 'toEvent' ||
          payment.payDirection === 'fromEvent'
      )
    },
})

export default paymentsFromAndToEventSelector
