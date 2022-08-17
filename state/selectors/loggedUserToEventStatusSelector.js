import userToEventStatus from '@helpers/userToEventStatus'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { selectorFamily } from 'recoil'
import eventSelector from './eventSelector'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const loggedUserToEventStatusSelector = selectorFamily({
  key: 'loggedUserToEventStatusSelector',
  get:
    (id) =>
    ({ get }) => {
      const event = get(eventSelector(id))
      const loggedUser = get(loggedUserAtom)
      const eventUsers = get(eventsUsersFullByEventIdSelector(id))
      return userToEventStatus(event, loggedUser, eventUsers)
    },
})

export default loggedUserToEventStatusSelector
