import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import reviewsAtom from '@state/atoms/reviewsAtom'

const reviewSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return
    return get(reviewsAtom).find((item) => item._id === id)
  })
)

export default reviewSelector
