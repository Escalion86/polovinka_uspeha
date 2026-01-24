'use client'

import { atomFamily } from 'jotai-family'

const stateAtom = atomFamily({ loading: false, error: false })

export default stateAtom

