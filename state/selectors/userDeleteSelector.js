import { DEFAULT_USER } from '@helpers/constants'
import usersAtom from '@state/atoms/usersAtom'
import { selector } from 'recoil'

const userDeleteSelector = selector({
  key: 'userDeleteSelector',
  get: () => DEFAULT_USER,
  set: ({ set, get }, itemId) => {
    const items = get(usersAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(usersAtom, newItemsList)
  },
})

export default userDeleteSelector
