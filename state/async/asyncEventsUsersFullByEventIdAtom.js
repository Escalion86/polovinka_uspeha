'use client'

import { atomFamily } from 'jotai-family'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'
import locationAtom from '@state/atoms/locationAtom'

const asyncEventsUsersFullByEventIdAtom = atomFamily((eventId) =>
  atomWithRefreshAndDefault(async (get) => {
    if (!eventId) return []

    const location = get(locationAtom)
    if (!location || location === 'null' || location === 'undefined') return []

    const res = await getData(
      `/api/${location}/eventsusers/full`,
      { eventId },
      null,
      null,
      false
    )

    store.set(
      isLoadedAtom('asyncEventsUsersFullByEventIdAtom' + eventId),
      true
    )

    return Array.isArray(res) ? res : []
  })
)

export default asyncEventsUsersFullByEventIdAtom
