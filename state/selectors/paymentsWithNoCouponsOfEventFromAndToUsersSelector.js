import { selectorFamily } from 'recoil'
import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

export const paymentsWithNoCouponsOfEventFromAndToUsersSelector =
  selectorFamily({
    key: 'paymentsWithNoCouponsOfEventFromAndToUsersSelector',
    get:
      (id) =>
      ({ get }) => {
        if (!id) return []

        return get(paymentsOfEventFromAndToUsersSelector(id)).filter(
          (payment) => payment.payType !== 'coupon'
        )
      },
  })

export default paymentsWithNoCouponsOfEventFromAndToUsersSelector
