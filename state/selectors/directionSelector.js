import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_DIRECTION } from '@helpers/constants'
import directionsAtom from '@state/atoms/directionsAtom'

export const directionSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_DIRECTION
    return get(directionsAtom).find((item) => item._id === id)
  })
)

export default directionSelector
