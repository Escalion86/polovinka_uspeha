import { atom } from 'jotai'

import isUserAdmin from '@helpers/isUserAdmin'
import loggedUserActiveRoleNameAtom from '@state/jotai/atoms/loggedUserActiveRoleNameAtom'

const isLoggedUserAdminSelector = atom((get) =>
  isUserAdmin(get(loggedUserActiveRoleNameAtom))
)

export default isLoggedUserAdminSelector
