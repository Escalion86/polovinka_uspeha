import { atom } from 'jotai'

import paymentsWithoutEventIdSelector from './paymentsWithoutEventIdSelector'

export const badgePaymentsWithoutEventIdSelector = atom(
  (get) => get(paymentsWithoutEventIdSelector).length
)

export default badgePaymentsWithoutEventIdSelector
