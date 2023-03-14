import isUserModer from '@helpers/isUserModer'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import { selector } from 'recoil'

const isLoggedUserModerSelector = selector({
  key: 'isLoggedUserModerSelector',
  get: ({ get }) => isUserModer({ role: get(loggedUserActiveRoleAtom) }),
})

export default isLoggedUserModerSelector
