'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

const errorAtom = atomFamily((params) => atom(false))

export default errorAtom

