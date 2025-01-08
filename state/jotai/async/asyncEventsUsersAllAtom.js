import { atom } from 'jotai'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'
import store from '../store'

const asyncEventsUsersAllAtom = atom(async (get) => {
  const res = await getData('/api/eventsusers', null, null, null, false)
  store.set(isLoadedAtom('asyncEventsUsersAllAtom'), true)

  return res
})

export default asyncEventsUsersAllAtom
