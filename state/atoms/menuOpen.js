import { atom } from 'recoil'

const menuOpenAtom = atom({
  key: 'menuOpen', // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
})

export default menuOpenAtom
