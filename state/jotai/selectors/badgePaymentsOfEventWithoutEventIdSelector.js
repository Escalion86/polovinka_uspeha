import { atom } from 'jotai'

import paymentsOfEventWithoutEventIdSelector from './paymentsOfEventWithoutEventIdSelector'

export const badgePaymentsOfEventWithoutEventIdSelector = atom(
  (get) => get(paymentsOfEventWithoutEventIdSelector).length
)

export default badgePaymentsOfEventWithoutEventIdSelector
