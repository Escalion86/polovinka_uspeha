'use client'

import { atom } from 'jotai'

// import newslettersAtomAsync from '@state/async/newslettersAtomAsync'
// import newsletterSelector from './newsletterSelector'
import individualWeddingsSelector from '@state/async/individualWeddingsSelector'
// import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { RESET } from 'jotai/utils'
import individualWeddingsByUserIdAtom from '@state/async/individualWeddingsByUserIdAtom'

const individualWeddingEditSelector = atom(null, async (get, set, newItem) => {
  const userId = newItem.userId
  // const individualWedding = await get(individualWeddingsSelector(itemId))
  // if (get(isLoadedAtom('individualWeddingsByUserIdAtom' + userId))) {
  set(individualWeddingsByUserIdAtom(userId), RESET)
  // }
  // const newItemsList = newsletters.filter((item) => item._id !== itemId)
  // set(newslettersAtomAsync, newItemsList)
  // set(individualWeddingsSelector(itemId), null)
  set(individualWeddingsSelector(newItem._id), newItem)
})

export default individualWeddingEditSelector
