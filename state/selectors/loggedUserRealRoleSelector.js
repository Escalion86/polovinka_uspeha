import { atom } from 'jotai'

import rolesAtom from '@state/atoms/rolesAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

export const loggedUserRealRoleSelector = atom((get) => {
  const roles = get(rolesAtom)
  const loggedUser = get(loggedUserAtom)
  const loggedUserRole = roles.find(({ _id }) => _id === loggedUser.role)
  return loggedUserRole
})

export default loggedUserRealRoleSelector
