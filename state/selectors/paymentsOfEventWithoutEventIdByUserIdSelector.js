import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsOfEventWithoutEventIdSelector from './paymentsOfEventWithoutEventIdSelector'

export const paymentsOfEventWithoutEventIdByUserIdSelector = atomFamily((id) =>
  atom(async (get) => {
    const payments = await get(paymentsOfEventWithoutEventIdSelector)
    return payments.filter((payment) => payment.userId === id)
  })
)

export default paymentsOfEventWithoutEventIdByUserIdSelector
