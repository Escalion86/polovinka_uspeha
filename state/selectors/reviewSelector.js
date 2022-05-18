import { DEFAULT_REVIEW } from '@helpers/constants'
import reviewsAtom from '@state/atoms/reviewsAtom'
import { selectorFamily } from 'recoil'

export const reviewSelector = selectorFamily({
  key: 'reviewSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return DEFAULT_REVIEW
      return get(reviewsAtom).find((item) => item._id === id)
    },
})

export default reviewSelector
