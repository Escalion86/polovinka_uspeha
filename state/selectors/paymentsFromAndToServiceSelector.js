import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByServiceIdSelector from './paymentsByServiceIdSelector'

export const paymentsFromAndToServiceSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const payments = await get(paymentsByServiceIdSelector(id))
    return payments.filter(
      (payment) =>
        payment.payDirection === 'toService' ||
        payment.payDirection === 'fromService'
    )
  })
)

export default paymentsFromAndToServiceSelector
