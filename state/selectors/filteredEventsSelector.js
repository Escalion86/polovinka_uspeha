import visibleEventsForUser from '@helpers/visibleEventsForUser'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { selector } from 'recoil'
import isLoggedUserAdminSelector from './isLoggedUserAdminSelector'
import asyncEventsUsersByUserIdAtom from '@state/asyncSelectors/asyncEventsUsersByUserIdAtom'
import isLoggedUserModerSelector from './isLoggedUserModerSelector'

const filteredEventsSelector = selector({
  key: 'filteredEventsSelector',
  get: async ({ get }) => {
    const loggedUser = get(loggedUserAtom)
    const loggedUserActiveStatus = get(loggedUserActiveStatusAtom)
    const isLoggedUserAdmin = get(isLoggedUserAdminSelector)
    const isLoggedUserModer = get(isLoggedUserModerSelector)
    const events = get(eventsAtom)
    const eventsLoggedUser = await get(
      asyncEventsUsersByUserIdAtom(loggedUser?._id)
    )

    return visibleEventsForUser(
      events,
      eventsLoggedUser,
      loggedUser,
      false,
      isLoggedUserAdmin || isLoggedUserModer,
      loggedUserActiveStatus
    )
  },
})

export default filteredEventsSelector
