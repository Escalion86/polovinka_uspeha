import { atomWithDefault } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import locationAtom from '@state/atoms/locationAtom'

const asyncEventsUsersAllAtom = atomWithDefault(async (get) => {
  const location = get(locationAtom)
  const res = await getData(
    `/api/${location}/eventsusers`,
    null,
    null,
    null,
    false
  )
  store.set(isLoadedAtom('asyncEventsUsersAllAtom'), true)

  return res
})

export default asyncEventsUsersAllAtom
