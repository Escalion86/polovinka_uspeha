import { atom } from 'jotai'

import { DEFAULT_USER } from '@helpers/constants'
import usersAtom from '@state/atoms/usersAtom'

const userDeleteSelector = atom(DEFAULT_USER, (get, set, itemId) => {
  const items = get(usersAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(usersAtom, newItemsList)
})

export default userDeleteSelector
