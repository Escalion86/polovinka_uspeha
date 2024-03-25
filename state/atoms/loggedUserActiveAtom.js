import { atom } from 'recoil'

const loggedUserActiveAtom = atom({
  key: 'loggedUserActive',
  default: null,
})

export default loggedUserActiveAtom
