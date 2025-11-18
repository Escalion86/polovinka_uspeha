'use client'

import { atom } from 'jotai'
import { atomFamily, selectAtom } from 'jotai/utils'
import newslettersAtomAsync from '@state/async/newslettersAtomAsync'

const newslettersSelector = atom(async (get) => {
  const newsletters = await get(newslettersAtomAsync)
  return Array.isArray(newsletters) ? newsletters : []
})

const newsletterCutedSelector = atomFamily((id) =>
  selectAtom(
    newslettersSelector,
    (newsletters) =>
      id ? newsletters.find((item) => item._id === id) : undefined,
    (prev, next) => prev === next
  )
)

export default newsletterCutedSelector
