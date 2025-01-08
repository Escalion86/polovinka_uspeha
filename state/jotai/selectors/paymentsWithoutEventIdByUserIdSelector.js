import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsWithoutEventIdSelector from './paymentsWithoutEventIdSelector'

export const paymentsWithoutEventIdByUserIdSelector = atomFamily((id) =>
  atom((get) => {
    return get(paymentsWithoutEventIdSelector).filter(
      (payment) => payment.userId === id
    )
  })
)

export default paymentsWithoutEventIdByUserIdSelector
