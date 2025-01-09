import { atom } from 'jotai'

import directionsAtom from '@state/atoms/directionsAtom'

const filteredDirectionsSelector = atom((get) => {
  const directions = get(directionsAtom)
  return directions?.length > 0
    ? directions.filter((direction) => direction.showOnSite)
    : []
})

export default filteredDirectionsSelector
