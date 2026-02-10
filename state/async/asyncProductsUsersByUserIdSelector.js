'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import { getData } from '@helpers/CRUD'
import asyncProductsUsersAtom from '@state/async/asyncProductsUsersAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import locationAtom from '@state/atoms/locationAtom'

const asyncProductsUsersByUserIdSelector = atomFamily((userId) =>
  atom(async (get) => {
    if (!userId) return null
    if (get(isLoadedAtom('asyncProductsUsersAtom'))) {
      const allProductsUsers = await get(asyncProductsUsersAtom)
      store.set(
        isLoadedAtom('asyncProductsUsersByUserIdSelector' + userId),
        true
      )

      return allProductsUsers.filter(
        (productUser) => productUser.userId === userId
      )
    }

    const location = get(locationAtom)

    const res = await getData(
      `/api/${location}/productsusers`,
      { userId },
      null,
      null,
      false
    )
    store.set(
      isLoadedAtom('asyncProductsUsersByUserIdSelector' + userId),
      true
    )

    return res
  })
)

export default asyncProductsUsersByUserIdSelector

