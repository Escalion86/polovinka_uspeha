import { selector } from 'recoil'
import rolesAtom from '@state/atoms/rolesAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

export const loggedUserRealRoleSelector = selector({
  key: 'loggedUserRealRoleSelector',
  get: ({ get }) => {
    const roles = get(rolesAtom)
    const loggedUser = get(loggedUserAtom)
    const loggedUserRole = roles.find(({ _id }) => _id === loggedUser.role)
    return loggedUserRole
  },
})

export default loggedUserRealRoleSelector
