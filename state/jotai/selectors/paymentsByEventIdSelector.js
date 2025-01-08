import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

export const paymentsByEventIdSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_PAYMENT
    return get(asyncPaymentsAtom).filter((item) => item.eventId === id)
  })
)

export default paymentsByEventIdSelector
