import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventMansReserveSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []

    return await get(eventsUsersFullByEventIdSelector(id))
      .filter(
        (item) => item.user?.gender == 'male' && item.status === 'reserve'
      )
      .map((item) => item.user)
  })
)

export default eventMansReserveSelector
