import { selectorFamily } from 'recoil'
import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

export const paymentsOfEventWithNoCouponsFromAndToUsersSelector =
  selectorFamily({
    key: 'paymentsOfEventWithNoCouponsFromAndToUsersSelector',
    get:
      (id) =>
      ({ get }) => {
        if (!id) return []

        return get(paymentsOfEventFromAndToUsersSelector(id)).filter(
          (payment) => payment.payType !== 'coupon'
        )
      },
  })

export default paymentsOfEventWithNoCouponsFromAndToUsersSelector
