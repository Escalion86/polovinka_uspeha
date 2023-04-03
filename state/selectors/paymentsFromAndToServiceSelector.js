import { selectorFamily } from 'recoil'
import paymentsByServiceIdSelector from './paymentsByServiceIdSelector'

export const paymentsFromAndToServiceSelector = selectorFamily({
  key: 'paymentsFromAndToServiceSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(paymentsByServiceIdSelector(id)).filter(
        (payment) =>
          payment.payDirection === 'toService' ||
          payment.payDirection === 'fromService'
      )
    },
})

export default paymentsFromAndToServiceSelector
