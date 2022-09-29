import { atom } from 'recoil'

const historiesAtom = atom({
  key: 'histories',
  default: [],
})

export default historiesAtom
