import { atom } from 'jotai'

import asyncServicesUsersAtom from '@state/jotai/async/asyncServicesUsersAtom'

const servicesUsersEditSelector = atom(null, (get, set, newItem) => {
  const items = get(asyncServicesUsersAtom)
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
      set(asyncServicesUsersAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(asyncServicesUsersAtom, [...items, newItem])
    }
  } else if (newItem?.length > 0) {
    // Если это список объектов, то добавляем все объекты
    set(asyncServicesUsersAtom, [...items, ...newItem])
  }
})

export default servicesUsersEditSelector
