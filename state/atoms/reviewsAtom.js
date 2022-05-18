import { atom } from 'recoil'

const reviewsAtom = atom({
  key: 'reviews',
  default: [],
})

export default reviewsAtom
