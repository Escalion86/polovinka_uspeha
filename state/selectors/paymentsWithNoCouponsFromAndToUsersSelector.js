import { selectorFamily } from 'recoil'
import paymentsFromAndToUsersSelector from './paymentsFromAndToUsersSelector'

export const paymentsWithNoCouponsFromAndToUsersSelector = selectorFamily({
  key: 'paymentsWithNoCouponsFromAndToUsersSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(paymentsFromAndToUsersSelector(id)).filter(
        (payment) => payment.payType !== 'coupon'
      )
    },
})

export default paymentsWithNoCouponsFromAndToUsersSelector
