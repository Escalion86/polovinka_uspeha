import { atom } from 'jotai'

import { DEFAULT_ADDITIONAL_BLOCK } from '@helpers/constants'
import additionalBlocksAtom from '@state/jotai/atoms/additionalBlocksAtom'

const additionalBlockEditSelector = atom(
  () => DEFAULT_ADDITIONAL_BLOCK,
  (get, set, newItem) => {
    const items = get(additionalBlocksAtom)
    if (!newItem?._id) return
    const findedItem = items.find((item) => item._id === newItem._id)
    // Если мы обновляем существующий атом
    if (findedItem) {
      const newItemsList = items.map((item) => {
        if (item._id === newItem._id) return newItem
        return item
      })
      set(additionalBlocksAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(additionalBlocksAtom, [...items, newItem])
    }
  }
)

export default additionalBlockEditSelector
