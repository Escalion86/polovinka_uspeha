import { atom } from 'jotai'

import paymentsOfEventWithoutEventIdSelector from './paymentsOfEventWithoutEventIdSelector'

export const badgePaymentsOfEventWithoutEventIdSelector = atom(
  async (get) => (await get(paymentsOfEventWithoutEventIdSelector)).length
)

export default badgePaymentsOfEventWithoutEventIdSelector
