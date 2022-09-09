import { atom } from 'recoil'

const loggedUserActiveStatusAtom = atom({
  key: 'loggedUserActiveStatus',
  default: 'novice',
})

export default loggedUserActiveStatusAtom
