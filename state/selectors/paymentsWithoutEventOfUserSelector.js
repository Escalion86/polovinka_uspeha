import { selectorFamily } from 'recoil'
import paymentsWithoutEventSelector from './paymentsWithoutEventSelector'

export const paymentsWithoutEventOfUserSelector = selectorFamily({
  key: 'paymentsWithoutEventOfUserSelector',
  get:
    (id) =>
    ({ get }) => {
      return get(paymentsWithoutEventSelector).filter(
        (payment) => payment.userId === id
      )
    },
})

export default paymentsWithoutEventOfUserSelector
