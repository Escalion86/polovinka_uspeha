'use client'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
// import { atomWithDefault } from 'jotai/utils'
import locationAtom from '@state/atoms/locationAtom'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'

const usersAtomAsync = atomWithRefreshAndDefault(async (get) => {
  const location = get(locationAtom)
  const res = await getData(`/api/${location}/users/`, {}, null, null, false)
  store.set(isLoadedAtom('usersAtomAsync'), true)
  return res
})

export default usersAtomAsync
