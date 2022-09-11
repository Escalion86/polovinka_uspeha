import visibleEventsForUser from '@helpers/visibleEventsForUser'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { selector } from 'recoil'
import eventsUsersByUserIdSelector from './eventsUsersByUserIdSelector'
import isLoggedUserAdminSelector from './isLoggedUserAdminSelector'

const filteredEventsSelector = selector({
  key: 'filteredEventsSelector',
  get: ({ get }) => {
    const loggedUser = get(loggedUserAtom)
    const loggedUserActiveStatus = get(loggedUserActiveStatusAtom)
    const isLoggedUserAdmin = get(isLoggedUserAdminSelector)
    const events = get(eventsAtom)
    const eventsLoggedUser = get(eventsUsersByUserIdSelector(loggedUser?._id))

    return visibleEventsForUser(
      events,
      eventsLoggedUser,
      loggedUser,
      false,
      isLoggedUserAdmin,
      loggedUserActiveStatus
    )
  },
})

export default filteredEventsSelector
