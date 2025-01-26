import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByEventIdSelector from './paymentsByEventIdSelector'

const paymentsToEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsByEventIdSelector(id))
    return payments.filter((payment) => payment.payDirection === 'toEvent')
  })
)

export default paymentsToEventSelector
