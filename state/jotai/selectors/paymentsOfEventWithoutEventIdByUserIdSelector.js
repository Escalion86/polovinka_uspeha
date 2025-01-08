import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsOfEventWithoutEventIdSelector from './paymentsOfEventWithoutEventIdSelector'

export const paymentsOfEventWithoutEventIdByUserIdSelector = atomFamily((id) =>
  atom((get) => {
    return get(paymentsOfEventWithoutEventIdSelector).filter(
      (payment) => payment.userId === id
    )
  })
)

export default paymentsOfEventWithoutEventIdByUserIdSelector
