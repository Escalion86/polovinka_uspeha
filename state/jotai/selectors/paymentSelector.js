import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

export const paymentSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_PAYMENT
    return get(asyncPaymentsAtom).find((item) => item._id === id)
  })
)

export default paymentSelector
