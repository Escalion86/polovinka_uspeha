import isUserAdmin from '@helpers/isUserAdmin'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import { selector } from 'recoil'

const isLoggedUserAdminSelector = selector({
  key: 'isLoggedUserAdminSelector',
  get: ({ get }) => isUserAdmin(get(loggedUserActiveRoleNameAtom)),
})

export default isLoggedUserAdminSelector
