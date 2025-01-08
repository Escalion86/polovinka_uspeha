import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByServiceIdSelector from './paymentsByServiceIdSelector'

export const paymentsFromAndToServiceSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(paymentsByServiceIdSelector(id)).filter(
      (payment) =>
        payment.payDirection === 'toService' ||
        payment.payDirection === 'fromService'
    )
  })
)

export default paymentsFromAndToServiceSelector
