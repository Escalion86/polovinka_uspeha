'use client'

import { atom } from 'jotai'

import directionsAtom from '@state/atoms/directionsAtom'
import directionFullSelectorAsync from './directionFullSelectorAsync'

const directionEditSelector = atom(null, (get, set, newItem) => {
  const items = get(directionsAtom)
  if (!newItem?._id) return
  const findedItem = items.find((event) => event._id === newItem._id)
  // Если мы обновляем существующий атом
  if (findedItem) {
    const newItemsList = items.map((event) => {
      if (event._id === newItem._id) return newItem
      return event
    })
    set(directionFullSelectorAsync(newItem._id), newItem)
    set(directionsAtom, newItemsList)
  } else {
    // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
    set(directionsAtom, [...items, newItem])
  }
})

export default directionEditSelector
