'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import { getData } from '@helpers/CRUD'
import asyncProductsUsersAtom from '@state/async/asyncProductsUsersAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import locationAtom from '@state/atoms/locationAtom'

const asyncProductsUsersByProductIdSelector = atomFamily((productId) =>
  atom(async (get) => {
    if (!productId) return null
    if (get(isLoadedAtom('asyncProductsUsersAtom'))) {
      const allProductsUsers = await get(asyncProductsUsersAtom)
      store.set(
        isLoadedAtom('asyncProductsUsersByProductIdSelector' + productId),
        true
      )

      return allProductsUsers.filter(
        (productUser) => productUser.productId === productId
      )
    }

    const location = get(locationAtom)

    const res = await getData(
      `/api/${location}/productsusers`,
      { productId },
      null,
      null,
      false
    )
    store.set(
      isLoadedAtom('asyncProductsUsersByProductIdSelector' + productId),
      true
    )

    return res
  })
)

export default asyncProductsUsersByProductIdSelector

