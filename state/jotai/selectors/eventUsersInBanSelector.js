import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventUsersInBanSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventsUsersFullByEventIdSelector(id))
      .filter((item) => item.status === 'ban')
      .map((item) => item.user)
  })
)

export default eventUsersInBanSelector
