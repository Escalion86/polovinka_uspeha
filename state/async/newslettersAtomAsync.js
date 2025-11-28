'use client'

import { getData } from '@helpers/CRUD'
import { NEWSLETTER_SENDING_STATUSES } from '@helpers/constantsNewsletters'
import locationAtom from '@state/atoms/locationAtom'
import atomWithRefreshAndDefault from '@state/atomWithRefreshAndDefault'

const newslettersAtomAsync = atomWithRefreshAndDefault(async (get) => {
  const location = get(locationAtom)
  const res = await getData(
    `/api/${location}/newsletters/`,
    {},
    null,
    null,
    false
  )
  return res?.map((newsletter) => {
    const normalizedSendingStatus =
      newsletter?.sendingStatus ||
      (newsletter?.status === 'active'
        ? NEWSLETTER_SENDING_STATUSES.SENT
        : undefined)

    return {
      ...newsletter,
      sendType: newsletter?.sendType || 'whatsapp-only',
      sendingStatus: normalizedSendingStatus,
    }
  })
})

export default newslettersAtomAsync
