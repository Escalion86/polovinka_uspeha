import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import { selector } from 'recoil'

const isLoggedUserDevSelector = selector({
  key: 'isLoggedUserDevSelector',
  get: ({ get }) => get(loggedUserActiveRoleNameAtom) === 'dev',
})

export default isLoggedUserDevSelector
