import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import { selector } from 'recoil'

const servicesUsersEditSelector = selector({
  key: 'servicesUsersEditSelector',
  get: () => {
    return null
  },
  set: ({ set, get }, newItem) => {
    const items = get(servicesUsersAtom)
    if (newItem?._id) {
      const findedItem = items.find(
        (servicesUsers) => servicesUsers._id === newItem._id
      )
      // Если мы обновляем существующий атом
      if (findedItem) {
        const newItemsList = items.map((servicesUsers) => {
          if (servicesUsers._id === newItem._id) return newItem
          return servicesUsers
        })
        set(servicesUsersAtom, newItemsList)
      } else {
        // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
        set(servicesUsersAtom, [...items, newItem])
      }
    } else if (newItem?.length > 0) {
      // Если это список объектов, то добавляем все объекты
      set(servicesUsersAtom, [...items, ...newItem])
    }
  },
})

export default servicesUsersEditSelector
