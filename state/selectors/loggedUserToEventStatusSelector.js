import userToEventStatus from '@helpers/userToEventStatus'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { selectorFamily } from 'recoil'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'
import subEventsSumOfEventSelector from './subEventsSumOfEventSelector'
import eventSelector from './eventSelector'
import directionSelector from './directionSelector'

export const loggedUserToEventStatusSelector = selectorFamily({
  key: 'loggedUserToEventStatusSelector',
  get:
    (id) =>
    ({ get }) => {
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
    },
})

export default loggedUserToEventStatusSelector
