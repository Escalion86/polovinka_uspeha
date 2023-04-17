import { atom } from 'recoil'

const productsUsersAtom = atom({
  key: 'productsUsers',
  default: [],
})

export default productsUsersAtom
