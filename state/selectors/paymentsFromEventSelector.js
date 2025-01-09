import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsFromEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsByEventIdSelector(id))
    return payments.filter((payment) => payment.payDirection === 'fromEvent')
  })
)

export default paymentsFromEventSelector
