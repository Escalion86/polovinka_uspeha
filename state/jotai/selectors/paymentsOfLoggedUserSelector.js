import { atom } from 'jotai'

import asyncPaymentsOfUserIdAtom from '@state/jotai/async/asyncPaymentsOfUserIdAtom'
import loggedUserActiveAtom from '@state/jotai/atoms/loggedUserActiveAtom'

export const paymentsOfLoggedUserSelector = atom(async (get) => {
  const loggedUserActive = get(loggedUserActiveAtom)
  if (!loggedUserActive) return []
  const result = await get(asyncPaymentsOfUserIdAtom(loggedUserActive._id))

  return result
})

export default paymentsOfLoggedUserSelector
