import { atomWithDefault } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'

const asyncEventsUsersAllAtom = atomWithDefault(async (get) => {
  const res = await getData('/api/eventsusers', null, null, null, false)
  store.set(isLoadedAtom('asyncEventsUsersAllAtom'), true)

  return res
})

export default asyncEventsUsersAllAtom
