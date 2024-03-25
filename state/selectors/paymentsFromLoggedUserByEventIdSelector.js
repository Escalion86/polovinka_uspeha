import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsFromLoggedUserByEventIdSelector = selectorFamily({
  key: 'paymentsFromLoggedUserByEventIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const loggedUserActive = get(loggedUserActiveAtom)
      if (!loggedUserActive) return []
      return get(paymentsByEventIdSelector(id)).filter(
        (item) => item.userId === loggedUserActive._id
      )
    },
})

export default paymentsFromLoggedUserByEventIdSelector
