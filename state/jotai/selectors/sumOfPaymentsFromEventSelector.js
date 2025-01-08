import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsFromEventSelector from './paymentsFromEventSelector'

export const sumOfPaymentsFromEventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    return (
      get(paymentsFromEventSelector(id)).reduce(
        (p, payment) => p + (payment.sum ?? 0),
        0
      ) / 100
    )
  })
)

export default sumOfPaymentsFromEventSelector
