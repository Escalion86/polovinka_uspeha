'use client'

import { atom } from 'jotai'

import productsAtom from '@state/atoms/productsAtom'

const productEditSelector = atom(null, (get, set, newItem) => {
  const items = get(productsAtom)
  if (!newItem?._id) return
  const findedItem = items.find((item) => item._id === newItem._id)
  if (findedItem) {
    const newItemsList = items.map((item) => {
      if (item._id === newItem._id) return newItem
      return item
    })
    set(productsAtom, newItemsList)
  } else {
    set(productsAtom, [...items, newItem])
  }
})

export default productEditSelector
