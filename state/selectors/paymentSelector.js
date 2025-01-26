import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

const paymentSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_PAYMENT
    const payments = await get(asyncPaymentsAtom)
    return payments.find((item) => item._id === id)
  })
)

export default paymentSelector
