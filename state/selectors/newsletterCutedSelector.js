'use client'

import { atomFamily } from 'jotai-family'
import { selectAtom } from 'jotai/utils'

import newslettersAtomAsync from '@state/async/newslettersAtomAsync'

const newsletterCutedSelector = atomFamily((id) =>
  selectAtom(newslettersAtomAsync, (newsletters = []) =>
    newsletters.find((item) => item._id === id)
  )
)

export default newsletterCutedSelector

