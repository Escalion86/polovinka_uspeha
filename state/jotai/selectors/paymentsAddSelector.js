import { atom } from 'jotai'

import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

const paymentsAddSelector = atom(
  () => get(asyncPaymentsAtom),
  (get, set, items) => {
    if (typeof items !== 'object') return
    const payments = get(asyncPaymentsAtom)
    set(asyncPaymentsAtom, [...payments, ...items])
  }
)

export default paymentsAddSelector
