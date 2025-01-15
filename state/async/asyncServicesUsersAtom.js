import { atomWithDefault } from 'jotai/utils'

import store from '../store'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const asyncServicesUsersAtom = atomWithDefault(async (get) => {
  const location = get(locationAtom)
  const res = await getData(
    `/api/${location}/servicesusers`,
    null,
    null,
    null,
    false
  )
  store.set(isLoadedAtom('asyncServicesUsersAtom'), true)

  return res
})

export default asyncServicesUsersAtom
