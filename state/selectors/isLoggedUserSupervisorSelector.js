import isUserSupervisor from '@helpers/isUserSupervisor'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import { selector } from 'recoil'

const isLoggedUserSupervisorSelector = selector({
  key: 'isLoggedUserSupervisorSelector',
  get: ({ get }) => isUserSupervisor({ role: get(loggedUserActiveRoleAtom) }),
})

export default isLoggedUserSupervisorSelector
