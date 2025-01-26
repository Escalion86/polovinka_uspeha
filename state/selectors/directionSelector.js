import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import directionsAtom from '@state/atoms/directionsAtom'

const directionSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return
    return get(directionsAtom).find((item) => item._id === id)
  })
)

export default directionSelector
