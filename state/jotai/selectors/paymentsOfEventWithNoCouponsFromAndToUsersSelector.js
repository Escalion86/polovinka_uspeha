import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

export const paymentsOfEventWithNoCouponsFromAndToUsersSelector = atomFamily(
  (id) =>
    atom((get) => {
      if (!id) return []

      return get(paymentsOfEventFromAndToUsersSelector(id)).filter(
        (payment) => payment.payType !== 'coupon'
      )
    })
)

export default paymentsOfEventWithNoCouponsFromAndToUsersSelector
