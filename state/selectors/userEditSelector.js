import { DEFAULT_USER } from '@helpers/constants'
import usersAtom from '@state/atoms/usersAtom'
import { selector } from 'recoil'

const userEditSelector = selector({
  key: 'userEditSelector',
  get: () => DEFAULT_USER,
  set: ({ set, get }, newItem) => {
    const items = get(usersAtom)
    if (!newItem?._id) return
    const findedItem = items.find((event) => event._id === newItem._id)
    // Если мы обновляем существующий атом
    if (findedItem) {
      const newItemsList = items.map((event) => {
        if (event._id === newItem._id) return newItem
        return event
      })
      set(usersAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(usersAtom, [...items, newItem])
    }
  },
})

export default userEditSelector
