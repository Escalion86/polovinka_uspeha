'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import userSelector from './userSelector'
import productSelector from './productSelector'
import asyncProductsUsersByProductIdSelector from '@state/async/asyncProductsUsersByProductIdSelector'

const productsUsersFullByProductIdSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    const productsUsers = await get(asyncProductsUsersByProductIdSelector(id))

    if (!productsUsers) return []

    const productsUsersFull = await Promise.all(
      productsUsers.map(async (item) => {
        const user = await get(userSelector(item.userId))
        const product = await get(productSelector(item.productId))
        return {
          ...item,
          user,
          product,
        }
      })
    )

    return productsUsersFull
  })
)

export default productsUsersFullByProductIdSelector

