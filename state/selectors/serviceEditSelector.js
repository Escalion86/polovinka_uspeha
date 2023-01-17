import { DEFAULT_SERIVICE } from '@helpers/constants'
import servicesAtom from '@state/atoms/servicesAtom'
import { selector } from 'recoil'

const serviceEditSelector = selector({
  key: 'serviceEditSelector',
  get: () => DEFAULT_SERIVICE,
  set: ({ set, get }, newItem) => {
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
  },
})

export default serviceEditSelector
