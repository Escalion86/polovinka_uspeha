'use client'

import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import locationAtom from '@state/atoms/locationAtom'
import { useAtomValue } from 'jotai'
import { readEventCardState } from '@utils/eventCardStateClient'

const useEventCardState = (eventId) => {
  const location = useAtomValue(locationAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const activeRoleName = useAtomValue(loggedUserActiveRoleNameAtom)

  return readEventCardState({
    location,
    eventId,
    loggedUserId: loggedUserActive?._id,
    activeRoleName,
  })
}

export default useEventCardState
