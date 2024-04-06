import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { selectorFamily } from 'recoil'
// import paymentsByEventIdSelector from './paymentsByEventIdSelector'
import paymentsOfLoggedUserSelector from './paymentsOfLoggedUserSelector'

export const paymentsOfLoggedUserByEventIdSelector = selectorFamily({
  key: 'paymentsOfLoggedUserByEventIdSelector',
  get:
    (id) =>
    async ({ get }) => {
      if (!id) return []
      const loggedUserActive = get(loggedUserActiveAtom)
      if (!loggedUserActive) return []
      const payments = await get(paymentsOfLoggedUserSelector)
      return payments.filter(({ eventId }) => eventId === id)
      // return get(paymentsByEventIdSelector(id)).filter(
      //   (item) => item.userId === loggedUserActive._id
      // )
    },
})

export default paymentsOfLoggedUserByEventIdSelector
