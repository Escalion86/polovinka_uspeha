import { atom } from 'jotai'

import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'

const isLoggedUserMemberSelector = atom(
  (get) => get(loggedUserActiveStatusAtom) === 'member'
)

export default isLoggedUserMemberSelector
