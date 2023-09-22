import { selectorFamily } from 'recoil'
// import userSelector from '@state/selectors/userSelector'

const isUserHaveActionsSelector = selectorFamily({
  key: 'isUserHaveActionsSelector',
  get:
    (id) =>
    async ({ get }) => {
      // const user = get(userSelector(id))
      const eventsOfUser = await get(asyncEventsUsersByUserIdAtom(id))
      // const eventUsers = get(eventsUsersFullByEventIdSelector(id))
      // return userToEventStatus(event, loggedUser, eventUsers)
      return eventsOfUser.length > 0
    },
})

export default isUserHaveActionsSelector
