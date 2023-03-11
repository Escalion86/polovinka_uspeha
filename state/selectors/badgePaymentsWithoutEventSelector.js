import { selector } from 'recoil'
import paymentsWithoutEventSelector from './paymentsWithoutEventSelector'

export const badgePaymentsWithoutEventSelector = selector({
  key: 'badgePaymentsWithoutEventSelector',
  get: ({ get }) => get(paymentsWithoutEventSelector).length,
})

export default badgePaymentsWithoutEventSelector
