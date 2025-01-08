import { atom } from 'jotai'

import rolesAtom from '@state/jotai/atoms/rolesAtom'
import loggedUserActiveRoleNameAtom from '@state/jotai/atoms/loggedUserActiveRoleNameAtom'

export const loggedUserActiveRoleSelector = atom((get) => {
  const roles = get(rolesAtom)
  const role = get(loggedUserActiveRoleNameAtom)
  const loggedUserRole = roles.find(({ _id }) => _id === role)
  return loggedUserRole
})

export default loggedUserActiveRoleSelector
