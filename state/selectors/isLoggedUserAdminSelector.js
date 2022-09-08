import isUserAdmin from '@helpers/isUserAdmin'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { selector } from 'recoil'

const isLoggedUserAdminSelector = selector({
  key: 'isLoggedUserAdminSelector',
  get: ({ get }) => isUserAdmin(get(loggedUserAtom)),
})

export default isLoggedUserAdminSelector
