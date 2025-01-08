import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsOfEventFromAndToUsersSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(paymentsByEventIdSelector(id)).filter(
      (payment) =>
        payment.payDirection === 'toUser' || payment.payDirection === 'fromUser'
    )
  })
)

export default paymentsOfEventFromAndToUsersSelector
