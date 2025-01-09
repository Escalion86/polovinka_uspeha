import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsFromEventSelector from './paymentsFromEventSelector'

export const sumOfPaymentsFromEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsFromEventSelector(id))
    return payments.reduce((p, payment) => p + (payment.sum ?? 0), 0) / 100
  })
)

export default sumOfPaymentsFromEventSelector
