import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { DEFAULT_EVENT } from '@helpers/constants'
import eventFullAtomAsync from '@state/jotai/async/eventFullAtomAsync'
import eventsAtom from '@state/jotai/atoms/eventsAtom'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'

export const eventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return DEFAULT_EVENT
    if (get(isLoadedAtom('eventFullAtomAsync' + id))) {
      return get(eventFullAtomAsync(id))
    }
    return get(eventsAtom).find((item) => item._id === id)
  })
)

export default eventSelector
