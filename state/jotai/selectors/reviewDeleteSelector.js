import { atom } from 'jotai'

import { DEFAULT_REVIEW } from '@helpers/constants'
import reviewsAtom from '@state/jotai/atoms/reviewsAtom'

const reviewDeleteSelector = atom(DEFAULT_REVIEW, (get, set, itemId) => {
  const items = get(reviewsAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(reviewsAtom, newItemsList)
})

export default reviewDeleteSelector
