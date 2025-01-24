import { atom } from 'jotai'

import reviewsAtom from '@state/atoms/reviewsAtom'

const reviewDeleteSelector = atom(null, (get, set, itemId) => {
  const items = get(reviewsAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(reviewsAtom, newItemsList)
})

export default reviewDeleteSelector
