'use client'

import { atom } from 'jotai'

import asyncProductsUsersAtom from '@state/async/asyncProductsUsersAtom'

const productsUsersEditSelector = atom(null, async (get, set, newItem) => {
  const items = await get(asyncProductsUsersAtom)

  if (newItem?._id) {
    const findedItem = items.find(
      (productsUsers) => productsUsers._id === newItem._id
    )
    // Если мы обновляем существующий атом
    if (findedItem) {
      const newItemsList = items.map((productsUsers) => {
        if (productsUsers._id === newItem._id) return newItem
        return productsUsers
      })
      set(asyncProductsUsersAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(asyncProductsUsersAtom, [...items, newItem])
    }
  } else if (newItem?.length > 0) {
    // Если это список объектов, то добавляем все объекты
    set(asyncProductsUsersAtom, [...items, ...newItem])
  }
})

export default productsUsersEditSelector
