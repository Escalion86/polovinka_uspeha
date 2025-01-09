import { atom } from 'jotai'

import { DEFAULT_USER } from '@helpers/constants'
import usersAtomAsync from '@state/async/usersAtomAsync'

const userDeleteSelector = atom(DEFAULT_USER, async (get, set, itemId) => {
  const users = await get(usersAtomAsync)
  const newItemsList = users.filter((item) => item._id !== itemId)
  set(usersAtomAsync, newItemsList)
})

export default userDeleteSelector
