'use client'

import { atomWithDefault } from 'jotai/utils'

import store from '../store'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const asyncProductsUsersAtom = atomWithDefault(async (get) => {
  const location = get(locationAtom)
  const res = await getData(
    `/api/${location}/productsusers`,
    null,
    null,
    null,
    false
  )
  store.set(isLoadedAtom('asyncProductsUsersAtom'), true)

  return res
})

export default asyncProductsUsersAtom
