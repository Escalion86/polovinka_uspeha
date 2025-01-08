import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

export const paymentsByUserIdSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_PAYMENT
    // if (id === 'all') return get(paymentsOfLoggedUserSelector)
    return get(asyncPaymentsAtom).filter((item) => item.userId === id)
  })
)

export default paymentsByUserIdSelector
