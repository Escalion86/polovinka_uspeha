import { selector } from 'recoil'
import rolesAtom from '@state/atoms/rolesAtom'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'

export const loggedUserActiveRoleSelector = selector({
  key: 'loggedUserActiveRoleSelector',
  get: ({ get }) => {
    const roles = get(rolesAtom)
    const role = get(loggedUserActiveRoleNameAtom)
    const loggedUserRole = roles.find(({ _id }) => _id === role)
    return loggedUserRole
  },
})

export default loggedUserActiveRoleSelector
