import { DEFAULT_DIRECTION } from '@helpers/constants'
import directionsAtom from '@state/atoms/directionsAtom'
import { selector } from 'recoil'

const directionDeleteSelector = selector({
  key: 'directionDeleteSelector',
  get: () => DEFAULT_DIRECTION,
  set: ({ set, get }, itemId) => {
    const items = get(directionsAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(directionsAtom, newItemsList)
  },
})

export default directionDeleteSelector
