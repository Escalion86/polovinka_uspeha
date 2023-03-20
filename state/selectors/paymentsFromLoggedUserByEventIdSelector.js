import { DEFAULT_PAYMENT } from '@helpers/constants'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
// import paymentsAtom from '@state/atoms/paymentsAtom'
import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const paymentsFromLoggedUserByEventIdSelector = selectorFamily({
  key: 'paymentsFromLoggedUserByEventIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const loggedUser = get(loggedUserAtom)
      if (!loggedUser) return []
      return get(paymentsByEventIdSelector(id)).filter(
        (item) => item.userId === loggedUser._id
      )
    },
})

export default paymentsFromLoggedUserByEventIdSelector
