'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

const waitForResponseIndividualWeddingForUserIdAtom = atomFamily((params) =>
  atom({ loading: false, stage: null })
)

export default waitForResponseIndividualWeddingForUserIdAtom

