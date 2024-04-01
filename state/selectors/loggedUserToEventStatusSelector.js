import userToEventStatus from '@helpers/userToEventStatus'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { selectorFamily } from 'recoil'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'
import subEventsSumOfEventSelector from './subEventsSumOfEventSelector'
import eventSelector from './eventSelector'

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
