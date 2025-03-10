'use client'

import { atom } from 'jotai'

// import newslettersAtomAsync from '@state/async/newslettersAtomAsync'
// import newsletterSelector from './newsletterSelector'
import individualWeddingsSelector from '@state/async/individualWeddingsSelector'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { RESET } from 'jotai/utils'
import individualWeddingsByUserIdAtom from '@state/async/individualWeddingsByUserIdAtom'

const individualWeddingDeleteSelector = atom(null, async (get, set, itemId) => {
  const individualWedding = await get(individualWeddingsSelector(itemId))
  const userId = individualWedding.userId
  if (get(isLoadedAtom('individualWeddingsByUserIdAtom' + userId))) {
    set(individualWeddingsByUserIdAtom(userId), RESET)
  }
  // const newItemsList = newsletters.filter((item) => item._id !== itemId)
  // set(newslettersAtomAsync, newItemsList)
  set(individualWeddingsSelector(itemId), null)
  // set(individualWeddingsSelector(itemId), null)
})

export default individualWeddingDeleteSelector
