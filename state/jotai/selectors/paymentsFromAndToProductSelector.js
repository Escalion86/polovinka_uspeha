import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByProductIdSelector from './paymentsByProductIdSelector'

export const paymentsFromAndToProductSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(paymentsByProductIdSelector(id)).filter(
      (payment) =>
        payment.payDirection === 'toProduct' ||
        payment.payDirection === 'fromProduct'
    )
  })
)

export default paymentsFromAndToProductSelector
