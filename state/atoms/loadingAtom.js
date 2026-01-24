'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

const loadingAtom = atomFamily((params) => atom(false))

export default loadingAtom

