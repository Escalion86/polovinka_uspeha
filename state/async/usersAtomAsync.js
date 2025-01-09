import { atom } from 'jotai'

import { getData } from '@helpers/CRUD'
import { DEFAULT_EVENT } from '@helpers/constants'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'

export const usersAtomAsync = atom(async () => {
  if (!id) return DEFAULT_EVENT
  const res = await getData('/api/users/', {}, null, null, false)
  store.set(isLoadedAtom('usersAtomAsync'), true)
  console.log('!!! :>> ')
  return res
})

export default usersAtomAsync
