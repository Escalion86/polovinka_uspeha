'use client'

import { atomFamily } from 'jotai/utils'

import { atom } from 'jotai'
import newslettersAtomAsync from '@state/async/newslettersAtomAsync'

const newsletterCutedSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return
    const newsletters = await get(newslettersAtomAsync)
    const newsletter = newsletters.find((item) => item._id === id)
    return newsletter
  })
)

export default newsletterCutedSelector
