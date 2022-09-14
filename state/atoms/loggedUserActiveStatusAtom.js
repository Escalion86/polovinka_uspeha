import { atom } from 'recoil'

const loggedUserActiveStatusAtom = atom({
  key: 'loggedUserActiveStatus',
  default: null,
})

export default loggedUserActiveStatusAtom
