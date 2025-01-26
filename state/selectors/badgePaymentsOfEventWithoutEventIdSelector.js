import { atom } from 'jotai'

import paymentsOfEventWithoutEventIdSelector from './paymentsOfEventWithoutEventIdSelector'

const badgePaymentsOfEventWithoutEventIdSelector = atom(async (get) => {
  const payments = await get(paymentsOfEventWithoutEventIdSelector)
  return payments.length
})

export default badgePaymentsOfEventWithoutEventIdSelector
