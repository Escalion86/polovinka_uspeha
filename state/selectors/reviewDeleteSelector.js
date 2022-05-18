import { DEFAULT_REVIEW } from '@helpers/constants'
import reviewsAtom from '@state/atoms/reviewsAtom'
import { selector } from 'recoil'

const reviewDeleteSelector = selector({
  key: 'reviewDeleteSelector',
  get: () => DEFAULT_REVIEW,
  set: ({ set, get }, itemId) => {
    const items = get(reviewsAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(reviewsAtom, newItemsList)
  },
})

export default reviewDeleteSelector
