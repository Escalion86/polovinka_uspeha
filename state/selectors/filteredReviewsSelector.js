import reviewsAtom from '@state/atoms/reviewsAtom'
import { selector } from 'recoil'

const filteredReviewsSelector = selector({
  key: 'filteredReviewsSelector',
  get: ({ get }) => {
    const reviews = get(reviewsAtom)
    return reviews?.length > 0
      ? reviews.filter((review) => review.showOnSite)
      : []
  },
})

export default filteredReviewsSelector
