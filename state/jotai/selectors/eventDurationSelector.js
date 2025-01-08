import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import getEventDuration from '@helpers/getEventDuration'
import eventSelector from './eventSelector'

export const eventDurationSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return null
    const event = get(eventSelector(id))
    return getEventDuration(event)
  })
)

export default eventDurationSelector
