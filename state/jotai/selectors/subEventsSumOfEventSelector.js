import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import subEventsSummator from '@helpers/subEventsSummator'
import { DEFAULT_SUBEVENT_GENERATOR } from '@helpers/constants'
import eventSelector from './eventSelector'

export const subEventsSumOfEventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []
    const event = get(eventSelector(id))
    return event?.subEvents
      ? subEventsSummator(event.subEvents)
      : subEventsSummator([DEFAULT_SUBEVENT_GENERATOR()])
  })
)

export default subEventsSumOfEventSelector
