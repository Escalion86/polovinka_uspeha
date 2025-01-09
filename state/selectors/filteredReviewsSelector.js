import { atom } from 'jotai'

import reviewsAtom from '@state/atoms/reviewsAtom'

const filteredReviewsSelector = atom((get) => {
  const reviews = get(reviewsAtom)
  return reviews?.length > 0
    ? reviews.filter((review) => review.showOnSite)
    : []
})

export default filteredReviewsSelector
