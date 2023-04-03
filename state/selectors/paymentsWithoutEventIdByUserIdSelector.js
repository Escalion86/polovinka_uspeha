import { selectorFamily } from 'recoil'
import paymentsWithoutEventIdSelector from './paymentsWithoutEventIdSelector'

export const paymentsWithoutEventIdByUserIdSelector = selectorFamily({
  key: 'paymentsWithoutEventIdByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      return get(paymentsWithoutEventIdSelector).filter(
        (payment) => payment.userId === id
      )
    },
})

export default paymentsWithoutEventIdByUserIdSelector
