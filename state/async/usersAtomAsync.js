import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import { atomWithDefault } from 'jotai/utils'

export const usersAtomAsync = atomWithDefault(async () => {
  const res = await getData('/api/users/', {}, null, null, false)
  store.set(isLoadedAtom('usersAtomAsync'), true)
  console.log('!! usersAtomAsync is Loaded!!')
  return res
})

export default usersAtomAsync
