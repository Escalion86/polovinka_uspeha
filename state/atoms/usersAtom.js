import { atom } from 'recoil'

const usersAtom = atom({
  key: 'users',
  default: [],
})

export default usersAtom
