'use client'

import { atom } from 'jotai'

import newslettersAtomAsync from '@state/async/newslettersAtomAsync'
import newsletterSelector from './newsletterSelector'

const newsletterDeleteSelector = atom(null, async (get, set, itemId) => {
  const newsletters = await get(newslettersAtomAsync)
  const newItemsList = newsletters.filter((item) => item._id !== itemId)
  set(newslettersAtomAsync, newItemsList)
  set(newsletterSelector(itemId), null)
})

export default newsletterDeleteSelector
