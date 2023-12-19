import visibleEventsForUser from '@helpers/visibleEventsForUser'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { selector } from 'recoil'
import asyncEventsUsersByUserIdAtom from '@state/asyncSelectors/asyncEventsUsersByUserIdAtom'
import loggedUserActiveRoleSelector from './loggedUserActiveRoleSelector'

const filteredEventsSelector = selector({
  key: 'filteredEventsSelector',
  get: async ({ get }) => {
    const loggedUser = get(loggedUserAtom)
    const loggedUserActiveStatus = get(loggedUserActiveStatusAtom)
    const loggedUserActiveRole = get(loggedUserActiveRoleSelector)
    const seeHidden = loggedUserActiveRole?.events?.seeHidden

    const events = get(eventsAtom)
    const eventsLoggedUser = await get(
      asyncEventsUsersByUserIdAtom(loggedUser?._id)
    )

    return visibleEventsForUser(
      events,
      eventsLoggedUser,
      loggedUser,
      false,
      seeHidden,
      loggedUserActiveStatus
    )
  },
})

export default filteredEventsSelector
