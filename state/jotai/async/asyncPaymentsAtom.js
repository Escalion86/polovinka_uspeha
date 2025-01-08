import { atom } from 'jotai'

import store from '../store'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'

const asyncPaymentsAtom = atom(async ({ get }) => {
  const res = await getData('/api/payments', null, null, null, false)
  store.set(isLoadedAtom('asyncPaymentsAtom'), true)

  return res
})

export default asyncPaymentsAtom
