import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsFromAndToEventSelector from './paymentsFromAndToEventSelector'

export const sumOfPaymentsFromAndToEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsFromAndToEventSelector(id))
    return payments.reduce((p, payment) => p - (payment.sum ?? 0), 0) / 100
  })
)

export default sumOfPaymentsFromAndToEventSelector
