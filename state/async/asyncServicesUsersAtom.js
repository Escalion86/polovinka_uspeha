import { atomWithDefault } from 'jotai/utils'

import store from '../store'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { getData } from '@helpers/CRUD'

const asyncServicesUsersAtom = atomWithDefault(async () => {
  const res = await getData('/api/servicesusers', null, null, null, false)
  store.set(isLoadedAtom('asyncServicesUsersAtom'), true)

  return res
})

export default asyncServicesUsersAtom
