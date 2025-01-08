import { atom } from 'jotai'

import usersAtom from '@state/jotai/atoms/usersAtom'

export const membersSelector = atom((get) => {
  return get(usersAtom).filter((user) => user.status === 'member')
})

export default membersSelector
