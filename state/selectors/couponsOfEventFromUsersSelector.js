import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

const couponsOfEventFromUsersSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const payments = await get(paymentsOfEventFromAndToUsersSelector(id))

    return payments.filter((payment) => payment.payType === 'coupon')
  })
)

export default couponsOfEventFromUsersSelector
