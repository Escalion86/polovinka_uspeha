import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_DIRECTION } from '@helpers/constants'
import { getData } from '@helpers/CRUD'
// import directionsAtom from '@state/atoms/directionsAtom'

export const directionFullSelectorAsync = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_DIRECTION
    // return get(directionsAtom).find((item) => item._id === id)
    const res = await getData('/api/directions/' + id, {}, null, null, false)
    console.log('directionFullSelectorAsync :>> ', id)
    return res
  })
)

export default directionFullSelectorAsync
