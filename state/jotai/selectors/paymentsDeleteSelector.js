import { atom } from 'jotai'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/jotai/async/asyncPaymentsAtom'

const paymentsDeleteSelector = atom(
  () => DEFAULT_PAYMENT,
  (get, set, itemId) => {
    const items = get(asyncPaymentsAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(asyncPaymentsAtom, newItemsList)
  }
)

export default paymentsDeleteSelector
