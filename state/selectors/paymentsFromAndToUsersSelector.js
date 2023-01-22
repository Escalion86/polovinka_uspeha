import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsFromAndToUsersSelector = selectorFamily({
  key: 'paymentsFromAndToUsersSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(paymentsByEventIdSelector(id)).filter(
        (payment) =>
          payment.payDirection === 'toUser' ||
          payment.payDirection === 'fromUser'
      )
    },
})

export default paymentsFromAndToUsersSelector
