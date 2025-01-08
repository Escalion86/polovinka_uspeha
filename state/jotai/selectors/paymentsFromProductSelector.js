import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByProductIdSelector from './paymentsByProductIdSelector'

export const paymentsFromProductSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    return get(paymentsByProductIdSelector(id)).filter(
      (payment) => payment.payDirection === 'fromProduct'
    )
  })
)

export default paymentsFromProductSelector
