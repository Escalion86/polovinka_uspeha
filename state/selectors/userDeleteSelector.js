'use client'

import { atom } from 'jotai'

import usersAtomAsync from '@state/async/usersAtomAsync'
import userSelector from './userSelector'

const userDeleteSelector = atom(null, async (get, set, itemId) => {
  const users = await get(usersAtomAsync)
  const newItemsList = users.filter((item) => item._id !== itemId)
  set(usersAtomAsync, newItemsList)
  set(userSelector(itemId), null)
})

export default userDeleteSelector
