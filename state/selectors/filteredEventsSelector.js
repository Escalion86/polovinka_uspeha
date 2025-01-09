import { atom } from 'jotai'

import visibleEventsForUser from '@helpers/visibleEventsForUser'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import asyncEventsUsersByUserIdAtom from '@state/async/asyncEventsUsersByUserIdAtom'
import loggedUserActiveRoleSelector from './loggedUserActiveRoleSelector'

const filteredEventsSelector = atom(async (get) => {
  const loggedUserActive = get(loggedUserActiveAtom)
  const loggedUserActiveStatus = get(loggedUserActiveStatusAtom)
  const loggedUserActiveRole = get(loggedUserActiveRoleSelector)
  const seeHidden = loggedUserActiveRole?.events?.seeHidden

  const events = get(eventsAtom)
  const eventsLoggedUser = await get(
    asyncEventsUsersByUserIdAtom(loggedUserActive?._id)
  )

  return visibleEventsForUser(
    events,
    eventsLoggedUser,
    loggedUserActive,
    false,
    seeHidden,
    loggedUserActiveStatus
  )
})

export default filteredEventsSelector
