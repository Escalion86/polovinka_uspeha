import { atom } from 'jotai'

import store from '../store'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { getData } from '@helpers/CRUD'

const asyncPaymentsAtom = atom(async () => {
  const res = await getData('/api/payments', null, null, null, false)
  store.set(isLoadedAtom('asyncPaymentsAtom'), true)

  return res
})

export default asyncPaymentsAtom
