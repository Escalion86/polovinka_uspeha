import isUserAdmin from '@helpers/isUserAdmin'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import { selector } from 'recoil'

const isLoggedUserAdminSelector = selector({
  key: 'isLoggedUserAdminSelector',
  get: ({ get }) => isUserAdmin({ role: get(loggedUserActiveRoleAtom) }),
})

export default isLoggedUserAdminSelector
