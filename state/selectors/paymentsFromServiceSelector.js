import { selectorFamily } from 'recoil'
import paymentsByServiceIdSelector from './paymentsByServiceIdSelector'

export const paymentsFromServiceSelector = selectorFamily({
  key: 'paymentsFromServiceSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      return get(paymentsByServiceIdSelector(id)).filter(
        (payment) => payment.payDirection === 'fromService'
      )
    },
})

export default paymentsFromServiceSelector
