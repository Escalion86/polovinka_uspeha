'use client'

import { atom } from 'jotai'

import productsAtom from '@state/atoms/productsAtom'

const productDeleteSelector = atom(null, (get, set, itemId) => {
  const items = get(productsAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(productsAtom, newItemsList)
})

export default productDeleteSelector
