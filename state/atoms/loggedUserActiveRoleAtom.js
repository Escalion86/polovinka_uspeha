import { atom } from 'recoil'

const loggedUserActiveRoleAtom = atom({
  key: 'loggedUserActiveRole',
  default: null,
})

export default loggedUserActiveRoleAtom
