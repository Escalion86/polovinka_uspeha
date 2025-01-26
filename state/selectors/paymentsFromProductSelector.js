import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByProductIdSelector from './paymentsByProductIdSelector'

const paymentsFromProductSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsByProductIdSelector(id))
    return payments.filter((payment) => payment.payDirection === 'fromProduct')
  })
)

export default paymentsFromProductSelector
