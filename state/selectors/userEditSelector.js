import { atom } from 'jotai'

import { DEFAULT_USER } from '@helpers/constants'
import usersAtomAsync from '@state/async/usersAtomAsync'

const userEditSelector = atom(DEFAULT_USER, async (get, set, newItem) => {
  const items = await get(usersAtomAsync)
  if (!newItem?._id) return
  const findedItem = items.find((event) => event._id === newItem._id)
  // Если мы обновляем существующий атом
  if (findedItem) {
    const newItemsList = items.map((event) => {
      if (event._id === newItem._id) return newItem
      return event
    })
    set(usersAtomAsync, newItemsList)
  } else {
    // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
    set(usersAtomAsync, [...items, newItem])
  }
})

export default userEditSelector
