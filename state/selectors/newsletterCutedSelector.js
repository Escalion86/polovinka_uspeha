'use client'

import { atom } from 'jotai'
import { atomFamily, selectAtom } from 'jotai/utils'
import newslettersAtomAsync from '@state/async/newslettersAtomAsync'

const newslettersSelector = atom((get) => get(newslettersAtomAsync) ?? [])

const newsletterCutedSelector = atomFamily((id) =>
  selectAtom(
    newslettersSelector,
    (newsletters) => newsletters.find((item) => item._id === id),
    (prev, next) => prev === next
  )
)

export default newsletterCutedSelector
