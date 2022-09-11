import directionsAtom from '@state/atoms/directionsAtom'
import { selector } from 'recoil'

const filteredDirectionsSelector = selector({
  key: 'filteredDirectionsSelector',
  get: ({ get }) => {
    const directions = get(directionsAtom)
    return directions.filter((direction) => direction.showOnSite)
  },
})

export default filteredDirectionsSelector
