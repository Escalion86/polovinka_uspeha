'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import asyncProductsUsersAtom from '@state/async/asyncProductsUsersAtom'

const productsUsersSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return null
    const productsUsers = await get(asyncProductsUsersAtom)
    return productsUsers?.find((item) => item._id === id)
  })
)

export default productsUsersSelector

