import userToEventStatus from '@helpers/userToEventStatus'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
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
      const loggedUserActive = get(loggedUserActiveAtom)
      const eventUsers = get(eventsUsersFullByEventIdSelector(id))
      const subEventSum = get(subEventsSumOfEventSelector(id))
      return userToEventStatus(event, loggedUserActive, eventUsers, subEventSum)
    },
})

export default loggedUserToEventStatusSelector
