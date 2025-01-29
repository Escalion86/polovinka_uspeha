'use client'

import { atom } from 'jotai'

import usersAtomAsync from '@state/async/usersAtomAsync'
import userSelector from './userSelector'

const userEditSelector = atom(null, async (get, set, newItem) => {
  const users = await get(usersAtomAsync)
  if (!newItem?._id) return
  const findedItem = users.find((user) => user._id === newItem._id)
  // Если мы обновляем существующий атом
  if (findedItem) {
    const newUsersList = users.map((user) => {
      if (user._id === newItem._id) return newItem
      return user
    })
    set(usersAtomAsync, newUsersList)
  } else {
    // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
    set(usersAtomAsync, [...users, newItem])
  }
  set(userSelector(newItem._id), newItem)
})

export default userEditSelector
