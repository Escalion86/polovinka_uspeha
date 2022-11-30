import usersAtom from '@state/atoms/usersAtom'
import { selector } from 'recoil'

export const membersSelector = selector({
  key: 'membersSelector',
  get: ({ get }) => {
    return get(usersAtom).filter((user) => user.status === 'member')
  },
})

export default membersSelector
