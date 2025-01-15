import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

export const paymentsByUserIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_PAYMENT
    // if (id === 'all') return get(paymentsOfLoggedUserSelector)
    const payments = await get(asyncPaymentsAtom)
    return payments.filter((item) => item.userId === id)
  })
)

export default paymentsByUserIdSelector
