import { atom } from 'jotai'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

const paymentsDeleteSelector = atom(
  () => DEFAULT_PAYMENT,
  async (get, set, itemId) => {
    const payments = await get(asyncPaymentsAtom)
    const newItemsList = payments.filter((item) => item._id !== itemId)
    set(asyncPaymentsAtom, newItemsList)
  }
)

export default paymentsDeleteSelector
