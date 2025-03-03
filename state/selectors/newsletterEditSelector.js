'use client'

import { atom } from 'jotai'

import newslettersAtomAsync from '@state/async/newslettersAtomAsync'
import newsletterSelector from './newsletterSelector'

const newsletterEditSelector = atom(null, async (get, set, newItem) => {
  const newsletters = await get(newslettersAtomAsync)
  if (!newItem?._id) return
  const findedItem = newsletters.find(
    (newsletter) => newsletter._id === newItem._id
  )
  // Если мы обновляем существующий атом
  if (findedItem) {
    const newNewslettersList = newsletters.map((newsletter) => {
      if (newsletter._id === newItem._id) return newItem
      return newsletter
    })
    set(newslettersAtomAsync, newNewslettersList)
  } else {
    // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
    set(newslettersAtomAsync, [...newsletters, newItem])
  }
  set(newsletterSelector(newItem._id), newItem)
})

export default newsletterEditSelector
