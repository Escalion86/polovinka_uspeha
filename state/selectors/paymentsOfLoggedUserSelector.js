import { atom } from 'jotai'

import asyncPaymentsOfUserIdAtom from '@state/async/asyncPaymentsOfUserIdAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'

const paymentsOfLoggedUserSelector = atom(async (get) => {
  const loggedUserActive = get(loggedUserActiveAtom)
  if (!loggedUserActive) return []
  const result = await get(asyncPaymentsOfUserIdAtom(loggedUserActive._id))

  return result
})

export default paymentsOfLoggedUserSelector
