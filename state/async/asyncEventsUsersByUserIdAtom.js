// import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'

const asyncEventsUsersByUserIdAtom = atomFamily((userId) =>
  atomWithRefreshAndDefault(async () => {
    if (!userId) return undefined
    const res = await getData('/api/eventsusers', { userId }, null, null, false)
    store.set(isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId), true)
    return res
  })
)

export default asyncEventsUsersByUserIdAtom
