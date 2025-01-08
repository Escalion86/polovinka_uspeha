import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventUsersInReserveSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return [
      ...get(eventsUsersFullByEventIdSelector(id)).filter(
        (item) => item.status === 'reserve'
      ),
    ]
      .sort((a, b) => (getDiffBetweenDates(a.createdAt, b.createdAt) ? 1 : -1))
      .map((item) => item.user)
  })
)

export default eventUsersInReserveSelector
