import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsWithoutEventIdByUserIdSelector from './paymentsWithoutEventIdByUserIdSelector'

export const sumOfPaymentsWithoutEventIdByUserIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsWithoutEventIdByUserIdSelector(id))
    return payments.reduce((p, payment) => p + (payment.sum ?? 0), 0) / 100
  })
)

export default sumOfPaymentsWithoutEventIdByUserIdSelector
