import { DEFAULT_DIRECTION } from '@helpers/constants'
import directionsAtom from '@state/atoms/directionsAtom'
import { selectorFamily } from 'recoil'

export const directionSelector = selectorFamily({
  key: 'directionSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_DIRECTION
      return get(directionsAtom).find((item) => item._id === id)
    },
})

export default directionSelector
