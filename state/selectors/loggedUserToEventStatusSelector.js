'use client'

import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'

import userToEventStatus from '@helpers/userToEventStatus'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'
import subEventsSumOfEventSelector from './subEventsSumOfEventSelector'
import eventSelector from './eventSelector'
import directionSelector from './directionSelector'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'

const loggedUserToEventStatusSelector = atomFamily((id) =>
  atom(async (get) => {
    const event = await get(eventSelector(id))
    const loggedUserActive = get(loggedUserActiveAtom)
    const eventUsers = await get(eventsUsersFullByEventIdSelector(id))
    const subEventSum = await get(subEventsSumOfEventSelector(id))
    const direction = get(directionSelector(event?.directionId))
    const activeRoleName = get(loggedUserActiveRoleNameAtom)
    const rules = direction?.rules

    return userToEventStatus({
      event,
      user: loggedUserActive,
      eventUsersFull: eventUsers,
      subEventSum,
      rules,
      activeRoleName,
    })
  })
)

export default loggedUserToEventStatusSelector

