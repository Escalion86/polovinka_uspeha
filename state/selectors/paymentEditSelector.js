import { atom } from 'jotai'

import { DEFAULT_PAYMENT } from '@helpers/constants'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

const paymentEditSelector = atom(
  () => DEFAULT_PAYMENT,
  async (get, set, newItem) => {
    const items = await get(asyncPaymentsAtom)
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
  }
)

export default paymentEditSelector
