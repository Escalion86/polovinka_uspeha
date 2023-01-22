import { selectorFamily } from 'recoil'
import paymentsFromAndToUsersSelector from './paymentsFromAndToUsersSelector'

export const couponsOfEventFromUsersSelector = selectorFamily({
  key: 'couponsOfEventFromUsersSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(paymentsFromAndToUsersSelector(id)).filter(
        (payment) => payment.payType === 'coupon'
      )
    },
})

export default couponsOfEventFromUsersSelector
