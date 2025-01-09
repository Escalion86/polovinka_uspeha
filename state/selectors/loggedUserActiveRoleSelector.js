import { atom } from 'jotai'

import rolesAtom from '@state/atoms/rolesAtom'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'

export const loggedUserActiveRoleSelector = atom((get) => {
  const roles = get(rolesAtom)
  const role = get(loggedUserActiveRoleNameAtom)
  const loggedUserRole = roles.find(({ _id }) => _id === role)
  return loggedUserRole
})

export default loggedUserActiveRoleSelector
