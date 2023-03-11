import { selector } from 'recoil'
import paymentsWithoutUserWritingToEventSelector from './paymentsWithoutUserWritingToEventSelector'

export const badgePaymentsWithoutUserWritingToEventSelector = selector({
  key: 'badgePaymentsWithoutUserWritingToEventSelector',
  get: ({ get }) => get(paymentsWithoutUserWritingToEventSelector).length,
})

export default badgePaymentsWithoutUserWritingToEventSelector
