'use client'

import { atom } from 'jotai'

import asyncProductsUsersAtom from '@state/async/asyncProductsUsersAtom'

const productsUsersDeleteSelector = atom(null, async (get, set, itemId) => {
  const items = await get(asyncProductsUsersAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(asyncProductsUsersAtom, newItemsList)
})

export default productsUsersDeleteSelector
