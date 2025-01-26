import { atom } from 'jotai'

import usersAtomAsync from '@state/async/usersAtomAsync'

const membersSelector = atom(async (get) => {
  const users = await get(usersAtomAsync)
  return users.filter((user) => user.status === 'member')
})

export default membersSelector
