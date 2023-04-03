import { selectorFamily } from 'recoil'
import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

export const couponsOfEventFromUsersSelector = selectorFamily({
  key: 'couponsOfEventFromUsersSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(paymentsOfEventFromAndToUsersSelector(id)).filter(
        (payment) => payment.payType === 'coupon'
      )
    },
})

export default couponsOfEventFromUsersSelector
