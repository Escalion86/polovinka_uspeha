import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

const eventWomansReserveSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventUsers = await get(eventsUsersFullByEventIdSelector(id))

    return eventUsers
      .filter(
        (item) => item.user?.gender == 'famale' && item.status === 'reserve'
      )
      .map((item) => item.user)
  })
)

export default eventWomansReserveSelector
