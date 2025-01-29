'use client'

import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'
import locationAtom from '@state/atoms/locationAtom'

const asyncEventsUsersByEventIdAtom = atomFamily((eventId) =>
  atomWithRefreshAndDefault(async (get) => {
    if (!eventId) return
    const location = get(locationAtom)
    const res = await getData(
      `/api/${location}/eventsusers`,
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
