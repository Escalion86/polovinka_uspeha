import { selectorFamily } from 'recoil'
import paymentsByProductIdSelector from './paymentsByProductIdSelector'

export const paymentsFromProductSelector = selectorFamily({
  key: 'paymentsFromProductSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return get(paymentsByProductIdSelector(id)).filter(
        (payment) => payment.payDirection === 'fromProduct'
      )
    },
})

export default paymentsFromProductSelector
