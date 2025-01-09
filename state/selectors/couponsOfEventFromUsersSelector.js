import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

export const couponsOfEventFromUsersSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    return await get(paymentsOfEventFromAndToUsersSelector(id)).filter(
      (payment) => payment.payType === 'coupon'
    )
  })
)

export default couponsOfEventFromUsersSelector
