import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByServiceIdSelector from './paymentsByServiceIdSelector'

const paymentsFromServiceSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const payments = await get(paymentsByServiceIdSelector(id))
    return payments.filter((payment) => payment.payDirection === 'fromService')
  })
)

export default paymentsFromServiceSelector
