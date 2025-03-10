'use client'

import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
// import isLoadedAtom from '@state/atoms/isLoadedAtom'
// import store from '../store'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'
import locationAtom from '@state/atoms/locationAtom'

const individualWeddingsSelector = atomFamily((individualWeddingId) =>
  atomWithRefreshAndDefault(async (get) => {
    if (!individualWeddingId) return
    const location = get(locationAtom)
    const res = await getData(
      `/api/${location}/individualweddings/${individualWeddingId}`,
      {},
      null,
      null,
      false
    )
    return res
  })
)

export default individualWeddingsSelector
