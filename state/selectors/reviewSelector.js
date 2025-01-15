import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_REVIEW } from '@helpers/constants'
import reviewsAtom from '@state/atoms/reviewsAtom'

export const reviewSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_REVIEW
    return get(reviewsAtom).find((item) => item._id === id)
  })
)

export default reviewSelector
