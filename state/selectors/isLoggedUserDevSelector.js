import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import { selector } from 'recoil'

const isLoggedUserDevSelector = selector({
  key: 'isLoggedUserDevSelector',
  get: ({ get }) => get(loggedUserActiveRoleAtom) === 'dev',
})

export default isLoggedUserDevSelector
