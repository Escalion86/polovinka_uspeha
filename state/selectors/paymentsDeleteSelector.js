import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selector } from 'recoil'

const paymentsDeleteSelector = selector({
  key: 'paymentsDeleteSelector',
  get: () => DEFAULT_PAYMENT,
  set: ({ set, get }, itemId) => {
    const items = get(asyncPaymentsAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(asyncPaymentsAtom, newItemsList)
  },
})

export default paymentsDeleteSelector
