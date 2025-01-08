import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsSelector from './eventParticipantsSelector'

export const noviceOfEventSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []

    return get(eventParticipantsSelector(id)).filter(
      (user) => user.status === 'novice'
    )
  })
)

export default noviceOfEventSelector
