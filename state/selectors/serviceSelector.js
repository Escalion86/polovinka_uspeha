'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import servicesAtom from '@state/atoms/servicesAtom'

const serviceSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return
    return get(servicesAtom).find((item) => item._id === id)
  })
)

export default serviceSelector

