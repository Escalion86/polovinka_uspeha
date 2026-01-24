'use client'

import { atomFamily } from 'jotai-family'
import { atomWithDefault } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'

const eventSelector = atomFamily((id) =>
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
    return res
  })
)

export default eventSelector

