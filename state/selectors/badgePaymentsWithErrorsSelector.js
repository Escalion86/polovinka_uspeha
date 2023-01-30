import { selector } from 'recoil'
import paymentsWithoutUserWritingToEventSelector from './paymentsWithoutUserWritingToEventSelector'

export const badgePaymentsWithErrorsSelector = selector({
  key: 'badgePaymentsWithErrorsSelector',
  get: ({ get }) => get(paymentsWithoutUserWritingToEventSelector).length,
})

export default badgePaymentsWithErrorsSelector
