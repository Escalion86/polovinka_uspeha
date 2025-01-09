import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_EVENT } from '@helpers/constants'
import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventsAtom from '@state/atoms/eventsAtom'
import isLoadedAtom from '@state/atoms/isLoadedAtom'

export const eventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return DEFAULT_EVENT
    if (get(isLoadedAtom('eventFullAtomAsync' + id))) {
      return await get(eventFullAtomAsync(id))
    }
    return get(eventsAtom).find((item) => item._id === id)
  })
)

export default eventSelector
