import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsOfLoggedUserByEventIdSelector from './paymentsOfLoggedUserByEventIdSelector'

export const sumOfPaymentsFromLoggedUserToEventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    return (
      get(paymentsOfLoggedUserByEventIdSelector(id)).reduce(
        (p, payment) => p + (payment.sum ?? 0),
        0
      ) / 100
    )
  })
)

export default sumOfPaymentsFromLoggedUserToEventSelector
