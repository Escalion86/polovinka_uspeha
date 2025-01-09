import { atom } from 'jotai'

import paymentsWithoutEventIdSelector from './paymentsWithoutEventIdSelector'

export const badgePaymentsWithoutEventIdSelector = atom(
  async (get) => (await get(paymentsWithoutEventIdSelector)).length
)

export default badgePaymentsWithoutEventIdSelector
