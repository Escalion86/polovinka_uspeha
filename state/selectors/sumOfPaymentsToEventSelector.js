import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsToEventSelector from './paymentsToEventSelector'

const sumOfPaymentsToEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsToEventSelector(id))
    return payments.reduce((p, payment) => p - (payment.sum ?? 0), 0) / 100
  })
)

export default sumOfPaymentsToEventSelector
