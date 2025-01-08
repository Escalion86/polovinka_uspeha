import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsWithoutEventIdByUserIdSelector from './paymentsWithoutEventIdByUserIdSelector'

export const sumOfPaymentsWithoutEventIdByUserIdSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    return (
      get(paymentsWithoutEventIdByUserIdSelector(id)).reduce(
        (p, payment) => p + (payment.sum ?? 0),
        0
      ) / 100
    )
  })
)

export default sumOfPaymentsWithoutEventIdByUserIdSelector
