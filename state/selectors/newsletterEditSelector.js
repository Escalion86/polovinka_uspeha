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
  const isSameNewsletter = (a, b) => {
    if (a === b) return true
    if (!a || !b) return false

    try {
      const normalize = (value) => {
        if (Array.isArray(value)) return value.map(normalize)
        if (value && typeof value === 'object') {
          return Object.keys(value)
            .sort()
            .reduce((acc, key) => {
              acc[key] = normalize(value[key])
              return acc
            }, {})
        }
        return value
      }

      return (
        JSON.stringify(normalize(a)) === JSON.stringify(normalize(b))
      )
    } catch (error) {
      return false
    }
  }
  // Если мы обновляем существующий атом
  if (findedItem) {
    if (isSameNewsletter(findedItem, newItem)) return
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
