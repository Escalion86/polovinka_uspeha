import { atom } from 'jotai'

import paymentsWithoutUserWritingToEventSelector from './paymentsWithoutUserWritingToEventSelector'

export const badgePaymentsWithoutUserWritingToEventSelector = atom(
  (get) => get(paymentsWithoutUserWritingToEventSelector).length
)

export default badgePaymentsWithoutUserWritingToEventSelector
