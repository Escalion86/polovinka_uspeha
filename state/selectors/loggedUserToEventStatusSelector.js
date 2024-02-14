import userToEventStatus from '@helpers/userToEventStatus'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { selectorFamily } from 'recoil'
import eventSelector from './eventSelector'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'
import subEventsSumOfEventSelector from './subEventsSumOfEventSelector'

export const loggedUserToEventStatusSelector = selectorFamily({
  key: 'loggedUserToEventStatusSelector',
  get:
    (id) =>
    ({ get }) => {
      const event = get(eventSelector(id))
      const loggedUser = get(loggedUserAtom)
      const eventUsers = get(eventsUsersFullByEventIdSelector(id))
      const subEventSum = get(subEventsSumOfEventSelector(id))
      return userToEventStatus(event, loggedUser, eventUsers, subEventSum)
    },
})

export default loggedUserToEventStatusSelector
