import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventWomansReserveSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventsUsersFullByEventIdSelector(id))
      .filter(
        (item) => item.user?.gender == 'famale' && item.status === 'reserve'
      )
      .map((item) => item.user)
  })
)

export default eventWomansReserveSelector
