import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import { DEFAULT_EVENT } from '@helpers/constants'
import isLoadedAtom from '@state/jotai/atoms/isLoadedAtom'
import store from '../store'

export const eventFullAtomAsync = atomFamily((id) =>
  atom(async () => {
    if (!id) return DEFAULT_EVENT
    const res = await getData('/api/events/' + id, {}, null, null, false)
    store.set(isLoadedAtom('eventFullAtomAsync' + id), true)
    return res
  })
)

export default eventFullAtomAsync
