import { atom } from 'jotai'

import { DEFAULT_DIRECTION } from '@helpers/constants'
import directionsAtom from '@state/jotai/atoms/directionsAtom'

const directionDeleteSelector = atom(
  () => DEFAULT_DIRECTION,
  (get, set, itemId) => {
    const items = get(directionsAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(directionsAtom, newItemsList)
  }
)

export default directionDeleteSelector
