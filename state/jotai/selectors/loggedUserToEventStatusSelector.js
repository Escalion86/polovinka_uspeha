import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import userToEventStatus from '@helpers/userToEventStatus'
import loggedUserActiveAtom from '@state/jotai/atoms/loggedUserActiveAtom'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'
import subEventsSumOfEventSelector from './subEventsSumOfEventSelector'
import eventSelector from './eventSelector'
import directionSelector from './directionSelector'

export const loggedUserToEventStatusSelector = atomFamily((id) =>
  atom((get) => {
    const event = get(eventSelector(id))
    const loggedUserActive = get(loggedUserActiveAtom)
    const eventUsers = get(eventsUsersFullByEventIdSelector(id))
    const subEventSum = get(subEventsSumOfEventSelector(id))
    const direction = get(directionSelector(event.directionId))
    const rules = direction?.rules
    return userToEventStatus(
      event,
      loggedUserActive,
      eventUsers,
      subEventSum,
      rules
    )
  })
)

export default loggedUserToEventStatusSelector
