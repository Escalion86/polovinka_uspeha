import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsToEventSelector from './paymentsToEventSelector'

export const sumOfPaymentsToEventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    return (
      get(paymentsToEventSelector(id)).reduce(
        (p, payment) => p - (payment.sum ?? 0),
        0
      ) / 100
    )
  })
)

export default sumOfPaymentsToEventSelector
