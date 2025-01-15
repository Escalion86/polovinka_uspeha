import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

export const paymentsByProductIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_PAYMENT
    const payments = await get(asyncPaymentsAtom)
    return payments.filter((item) => item.productId === id)
  })
)

export default paymentsByProductIdSelector
