import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import { selector } from 'recoil'

const isLoggedUserMemberSelector = selector({
  key: 'isLoggedUserMemberSelector',
  get: ({ get }) => get(loggedUserActiveStatusAtom) === 'member',
})

export default isLoggedUserMemberSelector
