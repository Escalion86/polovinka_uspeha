'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

const isLoadedAtom = atomFamily((param) => atom(false))

export default isLoadedAtom

