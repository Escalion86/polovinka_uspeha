'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const errorAtom = atomFamily((params) => atom(false))

export default errorAtom
