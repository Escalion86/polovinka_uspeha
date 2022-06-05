import { DEFAULT_PAYMENT } from '@helpers/constants'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'

const paymentEditSelector = selector({
  key: 'paymentEditSelector',
  get: () => DEFAULT_PAYMENT,
  set: ({ set, get }, newItem) => {
    const items = get(paymentsAtom)
    if (!newItem?._id) return
    const findedItem = items.find((event) => event._id === newItem._id)
    // Если мы обновляем существующий атом
    if (findedItem) {
      const newItemsList = items.map((event) => {
        if (event._id === newItem._id) return newItem
        return event
      })
      set(paymentsAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(paymentsAtom, [...items, newItem])
    }
  },
})

export default paymentEditSelector
