import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsWithoutEventIdSelector from './paymentsWithoutEventIdSelector'

const paymentsWithoutEventIdByUserIdSelector = atomFamily((id) =>
  atom(async (get) => {
    const payments = await get(paymentsWithoutEventIdSelector)
    return payments.filter((payment) => payment.userId === id)
  })
)

export default paymentsWithoutEventIdByUserIdSelector
