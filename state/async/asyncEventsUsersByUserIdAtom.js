import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'

const asyncEventsUsersByUserIdAtom = atomFamily((userId) =>
  atom(async () => {
    if (!userId) return undefined
    const res = await getData('/api/eventsusers', { userId }, null, null, false)
    store.set(isLoadedAtom('asyncEventsUsersByUserIdAtom' + userId), true)
    return res
  })
)

export default asyncEventsUsersByUserIdAtom
