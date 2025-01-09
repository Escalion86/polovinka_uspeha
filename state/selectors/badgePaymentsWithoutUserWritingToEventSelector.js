import { atom } from 'jotai'

import paymentsWithoutUserWritingToEventSelector from './paymentsWithoutUserWritingToEventSelector'

export const badgePaymentsWithoutUserWritingToEventSelector = atom(
  async (get) => await get(paymentsWithoutUserWritingToEventSelector).length
)

export default badgePaymentsWithoutUserWritingToEventSelector
