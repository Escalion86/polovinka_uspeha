'use client'

import { atomWithDefault } from 'jotai/utils'

import store from '../store'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const asyncPaymentsAtom = atomWithDefault(async (get) => {
  const location = get(locationAtom)
  console.log('location :>> ', location)
  const res = await getData(
    `/api/${location}/payments`,
    null,
    null,
    null,
    false
  )
  store.set(isLoadedAtom('asyncPaymentsAtom'), true)

  return res
})

export default asyncPaymentsAtom
