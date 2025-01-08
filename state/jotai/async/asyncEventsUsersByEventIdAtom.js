import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'
import store from '../store'

const asyncEventsUsersByEventIdAtom = atomFamily((eventId) =>
  atom(async () => {
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
