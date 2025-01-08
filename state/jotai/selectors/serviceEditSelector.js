import { atom } from 'jotai'

import { DEFAULT_SERVICE } from '@helpers/constants'
import servicesAtom from '@state/jotai/atoms/servicesAtom'

const serviceEditSelector = atom(DEFAULT_SERVICE, (get, set, newItem) => {
  const items = get(servicesAtom)
  if (!newItem?._id) return
  const findedItem = items.find((item) => item._id === newItem._id)
  // Если мы обновляем существующий атом
  if (findedItem) {
    const newItemsList = items.map((item) => {
      if (item._id === newItem._id) return newItem
      return item
    })
    set(servicesAtom, newItemsList)
  } else {
    // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
    set(servicesAtom, [...items, newItem])
  }
})

export default serviceEditSelector
