import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import { selector } from 'recoil'

const paymentEditSelector = selector({
  key: 'paymentEditSelector',
  get: () => DEFAULT_PAYMENT,
  set: ({ set, get }, newItem) => {
    const items = get(asyncPaymentsAtom)
    if (!newItem?._id) return
    const findedItem = items.find((event) => event._id === newItem._id)
    // Если мы обновляем существующий атом
    if (findedItem) {
      const newItemsList = items.map((event) => {
        if (event._id === newItem._id) return newItem
        return event
      })
      set(asyncPaymentsAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(asyncPaymentsAtom, [...items, newItem])
    }
  },
})

export default paymentEditSelector
