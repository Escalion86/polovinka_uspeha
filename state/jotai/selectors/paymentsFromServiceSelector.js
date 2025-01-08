import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByServiceIdSelector from './paymentsByServiceIdSelector'

export const paymentsFromServiceSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    return get(paymentsByServiceIdSelector(id)).filter(
      (payment) => payment.payDirection === 'fromService'
    )
  })
)

export default paymentsFromServiceSelector
