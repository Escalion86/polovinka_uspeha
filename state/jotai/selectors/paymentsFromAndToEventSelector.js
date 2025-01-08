import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsFromAndToEventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(paymentsByEventIdSelector(id)).filter(
      (payment) =>
        payment.payDirection === 'toEvent' ||
        payment.payDirection === 'fromEvent'
    )
  })
)

export default paymentsFromAndToEventSelector
