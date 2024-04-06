// import asyncPaymentsOfUserIdAtom from '@state/async/asyncPaymentsOfUserIdAtom'
// import asyncPaymentsOfUserIdAtom from '@state/async/asyncPaymentsOfUserIdAtom'
import asyncPaymentsOfUserIdAtom from '@state/async/asyncPaymentsOfUserIdAtom'
// import asyncPaymentsOfUserIdSelector from '@state/async/asyncPaymentsOfUserIdSelector'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { selector } from 'recoil'

export const paymentsOfLoggedUserSelector = selector({
  key: 'paymentsOfLoggedUserSelector',
  get: async ({ get }) => {
    const loggedUser = get(loggedUserAtom)
    if (!loggedUser) return []
    const result = await get(asyncPaymentsOfUserIdAtom(loggedUser._id))

    return result
  },
})

export default paymentsOfLoggedUserSelector
