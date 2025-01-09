import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import isEventCanceled from '@helpers/isEventCanceled'
import isEventClosed from '@helpers/isEventClosed'
import isEventExpired from '@helpers/isEventExpired'
import isEventInProcess from '@helpers/isEventInProcess'
import eventSelector from './eventSelector'

export const eventStatusSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return null
    const event = await get(eventSelector(id))
    if (isEventCanceled(event)) return 'canceled'
    if (isEventClosed(event)) return 'closed'
    if (isEventExpired(event)) return 'finished'
    if (isEventInProcess(event)) return 'inProcess'
    return 'active'
  })
)

export default eventStatusSelector
