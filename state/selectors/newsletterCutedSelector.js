'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import newslettersAtomAsync from '@state/async/newslettersAtomAsync'

const newslettersSelector = atom(async (get) => {
  const newsletters = await get(newslettersAtomAsync)
  return Array.isArray(newsletters) ? newsletters : []
})

const newsletterCutedSelector = atomFamily((id) =>
  atom(async (get) => {
    const newsletters = await get(newslettersAtomAsync)

    if (!id) return undefined

    return Array.isArray(newsletters)
      ? newsletters.find((item) => item._id === id)
      : undefined
  })
)

export default newsletterCutedSelector
