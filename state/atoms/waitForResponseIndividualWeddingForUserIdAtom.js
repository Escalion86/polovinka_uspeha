'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const waitForResponseIndividualWeddingForUserIdAtom = atomFamily((params) =>
  atom(false)
)

export default waitForResponseIndividualWeddingForUserIdAtom
