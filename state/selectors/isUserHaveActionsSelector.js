import { selectorFamily } from 'recoil'
import eventsUsersByUserIdSelector from './eventsUsersByUserIdSelector'
// import userSelector from '@state/selectors/userSelector'

const isUserHaveActionsSelector = selectorFamily({
  key: 'isUserHaveActionsSelector',
  get:
    (id) =>
    ({ get }) => {
      // const user = get(userSelector(id))
      const eventsOfUser = get(eventsUsersByUserIdSelector(id))
      // const eventUsers = get(eventsUsersFullByEventIdSelector(id))
      // return userToEventStatus(event, loggedUser, eventUsers)
      return eventsOfUser.length > 0
    },
})

export default isUserHaveActionsSelector
