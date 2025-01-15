import { atom } from 'jotai'

import isUserAdmin from '@helpers/isUserAdmin'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'

const isLoggedUserAdminSelector = atom((get) =>
  isUserAdmin(get(loggedUserActiveRoleNameAtom))
)

export default isLoggedUserAdminSelector
