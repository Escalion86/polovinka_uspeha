import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selector } from 'recoil'

const eventsUsersEditSelector = selector({
  key: 'eventsUsersEditSelector',
  get: () => {
    return null
  },
  set: ({ set, get }, newItem) => {
    const items = get(eventsUsersAtom)
    if (newItem?._id) {
      const findedItem = items.find(
        (eventsUsers) => eventsUsers._id === newItem._id
      )
      // Если мы обновляем существующий атом
      if (findedItem) {
        const newItemsList = items.map((eventsUsers) => {
          if (eventsUsers._id === newItem._id) return newItem
          return eventsUsers
        })
        set(eventsUsersAtom, newItemsList)
      } else {
        // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
        set(eventsUsersAtom, [...items, newItem])
      }
    } else if (newItem?.length > 0) {
      // Если это список объектов, то добавляем все объекты
      set(eventsUsersAtom, [...items, ...newItem])
    }
  },
})

export default eventsUsersEditSelector
