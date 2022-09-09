import { atom } from 'recoil'

const loggedUserActiveRoleAtom = atom({
  key: 'loggedUserActiveRole',
  default: 'client',
})

export default loggedUserActiveRoleAtom
