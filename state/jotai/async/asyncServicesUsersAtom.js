import { atom } from 'jotai'

import store from '../store'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'

const asyncServicesUsersAtom = atom(async () => {
  const res = await getData('/api/servicesusers', null, null, null, false)
  store.set(isLoadedAtom('asyncServicesUsersAtom'), true)

  return res
})

export default asyncServicesUsersAtom
