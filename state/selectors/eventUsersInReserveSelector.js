import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

const eventUsersInReserveSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const eventUsersFull = await get(eventsUsersFullByEventIdSelector(id))

    return [...eventUsersFull.filter((item) => item.status === 'reserve')]
      .sort((a, b) => (getDiffBetweenDates(a.createdAt, b.createdAt) ? 1 : -1))
      .map((item) => item.user)
  })
)

export default eventUsersInReserveSelector
