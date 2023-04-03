import { atom } from 'recoil'

const productsAtom = atom({
  key: 'products',
  default: [],
})

export default productsAtom
