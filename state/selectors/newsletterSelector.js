'use client'

import { atomFamily } from 'jotai/utils'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'

const newsletterSelector = atomFamily((id) => {
  const newsletterSelectorAtom = atomWithRefreshAndDefault(async (get) => {
    if (!id) return

    const location = get(locationAtom)
    if (!location) return

    const res = await getData(
      `/api/${location}/newsletters/${id}`,
      {},
      null,
      null,
      false
    )
    if (!res) return res

    return { ...res, sendType: res.sendType || 'whatsapp-only' }
  })

  return newsletterSelectorAtom
})

export default newsletterSelector
