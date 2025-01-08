import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsToEventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    return get(paymentsByEventIdSelector(id)).filter(
      (payment) => payment.payDirection === 'toEvent'
    )
  })
)

export default paymentsToEventSelector
