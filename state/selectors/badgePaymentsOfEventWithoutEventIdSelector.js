import { selector } from 'recoil'
import paymentsOfEventWithoutEventIdSelector from './paymentsOfEventWithoutEventIdSelector'

export const badgePaymentsOfEventWithoutEventIdSelector = selector({
  key: 'badgePaymentsOfEventWithoutEventIdSelector',
  get: ({ get }) => get(paymentsOfEventWithoutEventIdSelector).length,
})

export default badgePaymentsOfEventWithoutEventIdSelector
