import directionsAtom from '@state/atoms/directionsAtom'
import { selector } from 'recoil'

const filteredDirectionsSelector = selector({
  key: 'filteredDirectionsSelector',
  get: ({ get }) => {
    const directions = get(directionsAtom)
    return directions?.length > 0
      ? directions.filter((direction) => direction.showOnSite)
      : []
  },
})

export default filteredDirectionsSelector
