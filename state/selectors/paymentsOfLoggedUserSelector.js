// import asyncPaymentsOfUserIdAtom from '@state/async/asyncPaymentsOfUserIdAtom'
// import asyncPaymentsOfUserIdAtom from '@state/async/asyncPaymentsOfUserIdAtom'
import asyncPaymentsOfUserIdAtom from '@state/async/asyncPaymentsOfUserIdAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
// import asyncPaymentsOfUserIdSelector from '@state/async/asyncPaymentsOfUserIdSelector'
import { selector } from 'recoil'

export const paymentsOfLoggedUserSelector = selector({
  key: 'paymentsOfLoggedUserSelector',
  get: async ({ get }) => {
    const loggedUserActive = get(loggedUserActiveAtom)
    if (!loggedUserActive) return []
    const result = await get(asyncPaymentsOfUserIdAtom(loggedUserActive._id))

    return result
  },
})

export default paymentsOfLoggedUserSelector
