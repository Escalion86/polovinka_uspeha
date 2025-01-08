import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventAssistantsSelector from './eventAssistantsSelector'

export const eventAssistantsIdsSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventAssistantsSelector(id)).map((user) => user._id)
  })
)

export default eventAssistantsIdsSelector
