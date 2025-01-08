import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import asyncEventsUsersByUserIdAtom from '@state/jotai/async/asyncEventsUsersByUserIdAtom'

const isUserHaveActionsSelector = atomFamily((id) =>
  atom(async (get) => {
    const eventsOfUser = await get(asyncEventsUsersByUserIdAtom(id))
    return eventsOfUser.length > 0
  })
)

export default isUserHaveActionsSelector
