import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import subEventsSummator from '@helpers/subEventsSummator'
import { DEFAULT_SUBEVENT_GENERATOR } from '@helpers/constants'
import eventSelector from './eventSelector'

const subEventsSumOfEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const event = await get(eventSelector(id))
    return event?.subEvents
      ? subEventsSummator(event.subEvents)
      : subEventsSummator([DEFAULT_SUBEVENT_GENERATOR()])
  })
)

export default subEventsSumOfEventSelector
