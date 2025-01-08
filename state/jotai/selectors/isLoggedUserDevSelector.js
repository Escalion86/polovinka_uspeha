import { atom } from 'jotai'

import loggedUserActiveRoleSelector from './loggedUserActiveRoleSelector'

const isLoggedUserDevSelector = atom(
  (get) => get(loggedUserActiveRoleSelector)?.dev
)

export default isLoggedUserDevSelector
