'use client'

import { atom } from 'jotai'

import directionsAtom from '@state/atoms/directionsAtom'

const directionDeleteSelector = atom(null, (get, set, itemId) => {
  const items = get(directionsAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(directionsAtom, newItemsList)
})

export default directionDeleteSelector
