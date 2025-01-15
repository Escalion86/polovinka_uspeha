import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsSelector from './eventParticipantsSelector'

export const membersOfEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const participants = await get(eventParticipantsSelector(id))

    return participants.filter((user) => user.status === 'member')
  })
)

export default membersOfEventSelector
