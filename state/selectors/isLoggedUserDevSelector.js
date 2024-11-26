import { selector } from 'recoil'
import loggedUserActiveRoleSelector from './loggedUserActiveRoleSelector'

const isLoggedUserDevSelector = selector({
  key: 'isLoggedUserDevSelector',
  get: ({ get }) => get(loggedUserActiveRoleSelector)?.dev,
})

export default isLoggedUserDevSelector
