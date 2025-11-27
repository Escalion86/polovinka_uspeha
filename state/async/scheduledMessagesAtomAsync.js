'use client'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'

const scheduledMessagesAtomAsync = atomWithRefreshAndDefault(async (get) => {
  const location = get(locationAtom)
  const res = await getData(
    `/api/${location}/scheduled-messages/`,
    {},
    null,
    null,
    false
  )
  return res ?? []
})

export default scheduledMessagesAtomAsync
