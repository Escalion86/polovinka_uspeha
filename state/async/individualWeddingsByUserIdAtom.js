'use client'

import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import isLoadedAtom from '@state/atoms/isLoadedAtom'
import store from '../store'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'
import locationAtom from '@state/atoms/locationAtom'

const individualWeddingsByUserIdAtom = atomFamily((userId) =>
  atomWithRefreshAndDefault(async (get) => {
    if (!userId) return
    const location = get(locationAtom)
    const res = await getData(
      `/api/${location}/individualweddings`,
      { userId },
      null,
      null,
      false
    )
    store.set(isLoadedAtom('individualWeddingsByUserIdAtom' + userId), true)
    return res
  })
)

export default individualWeddingsByUserIdAtom
