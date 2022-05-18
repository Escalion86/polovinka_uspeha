import { DEFAULT_REVIEW } from '@helpers/constants'
import reviewsAtom from '@state/atoms/reviewsAtom'
import { selector } from 'recoil'

const reviewEditSelector = selector({
  key: 'reviewEditSelector',
  get: () => DEFAULT_REVIEW,
  set: ({ set, get }, newItem) => {
    const items = get(reviewsAtom)
    if (!newItem?._id) return
    const findedItem = items.find((event) => event._id === newItem._id)
    // Если мы обновляем существующий атом
    if (findedItem) {
      const newItemsList = items.map((event) => {
        if (event._id === newItem._id) return newItem
        return event
      })
      set(reviewsAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(reviewsAtom, [...items, newItem])
    }
  },
})

export default reviewEditSelector
