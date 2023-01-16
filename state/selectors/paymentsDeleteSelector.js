import { DEFAULT_PAYMENT } from '@helpers/constants'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'

const paymentsDeleteSelector = selector({
  key: 'paymentsDeleteSelector',
  get: () => DEFAULT_PAYMENT,
  set: ({ set, get }, itemId) => {
    const items = get(paymentsAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(paymentsAtom, newItemsList)
  },
})

export default paymentsDeleteSelector
