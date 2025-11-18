'use client'

import { atomFamily, selectAtom } from 'jotai/utils'

import newslettersAtomAsync from '@state/async/newslettersAtomAsync'

const newsletterCutedSelector = atomFamily((id) =>
  selectAtom(newslettersAtomAsync, (newsletters = []) =>
    newsletters.find((item) => item._id === id)
  )
)

export default newsletterCutedSelector
