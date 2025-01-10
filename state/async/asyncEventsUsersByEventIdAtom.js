// import { atom } from 'jotai'
import { atomFamily, atomWithRefresh } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'

const asyncEventsUsersByEventIdAtom = atomFamily((eventId) =>
  atomWithRefreshAndDefault(async () => {
    if (!eventId) return undefined
    const res = await getData(
      '/api/eventsusers',
      { eventId },
      null,
      null,
      false
    )
    store.set(isLoadedAtom('asyncEventsUsersByEventIdAtom' + eventId), true)
    return res
  })
)

export default asyncEventsUsersByEventIdAtom
