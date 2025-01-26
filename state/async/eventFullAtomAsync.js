import { atomFamily, atomWithDefault } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import { DEFAULT_EVENT } from '@helpers/constants'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import locationAtom from '@state/atoms/locationAtom'

const eventFullAtomAsync = atomFamily((id) =>
  atomWithDefault(async (get) => {
    if (!id) return
    const location = get(locationAtom)
    const res = await getData(
      `/api/${location}/events/` + id,
      {},
      null,
      null,
      false
    )
    store.set(isLoadedAtom('eventFullAtomAsync' + id), true)
    return res
  })
)

export default eventFullAtomAsync
