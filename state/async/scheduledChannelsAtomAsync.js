'use client'

import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'

const scheduledChannelsAtomAsync = atomWithRefreshAndDefault(async (get) => {
  const location = get(locationAtom)
  const channels =
    (await getData(
      `/api/${location}/scheduled-channels/`,
      {},
      null,
      null,
      false
    )) || []
  return channels
})

export default scheduledChannelsAtomAsync
