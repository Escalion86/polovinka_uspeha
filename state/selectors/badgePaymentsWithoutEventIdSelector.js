import { selector } from 'recoil'
import paymentsWithoutEventIdSelector from './paymentsWithoutEventIdSelector'

export const badgePaymentsWithoutEventIdSelector = selector({
  key: 'badgePaymentsWithoutEventIdSelector',
  get: ({ get }) => get(paymentsWithoutEventIdSelector).length,
})

export default badgePaymentsWithoutEventIdSelector
