import { atom } from 'recoil'

const loggedUserActiveRoleNameAtom = atom({
  key: 'loggedUserActiveRoleName',
  default: null,
})

export default loggedUserActiveRoleNameAtom
