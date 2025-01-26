import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const directionFullSelectorAsync = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return
    // return get(directionsAtom).find((item) => item._id === id)
    const location = get(locationAtom)
    const res = await getData(
      `/api/${location}/directions/${id}`,
      {},
      null,
      null,
      false
    )
    return res
  })
)

export default directionFullSelectorAsync
