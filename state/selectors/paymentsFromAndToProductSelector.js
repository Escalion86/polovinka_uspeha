import { selectorFamily } from 'recoil'
import paymentsByProductIdSelector from './paymentsByProductIdSelector'

export const paymentsFromAndToProductSelector = selectorFamily({
  key: 'paymentsFromAndToProductSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(paymentsByProductIdSelector(id)).filter(
        (payment) =>
          payment.payDirection === 'toProduct' ||
          payment.payDirection === 'fromProduct'
      )
    },
})

export default paymentsFromAndToProductSelector
