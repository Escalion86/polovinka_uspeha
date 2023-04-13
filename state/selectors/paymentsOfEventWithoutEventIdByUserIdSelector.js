import { selectorFamily } from 'recoil'
import paymentsOfEventWithoutEventIdSelector from './paymentsOfEventWithoutEventIdSelector'

export const paymentsOfEventWithoutEventIdByUserIdSelector = selectorFamily({
  key: 'paymentsOfEventWithoutEventIdByUserIdSelector',
  get:
    (id) =>
    ({ get }) => {
      return get(paymentsOfEventWithoutEventIdSelector).filter(
        (payment) => payment.userId === id
      )
    },
})

export default paymentsOfEventWithoutEventIdByUserIdSelector
