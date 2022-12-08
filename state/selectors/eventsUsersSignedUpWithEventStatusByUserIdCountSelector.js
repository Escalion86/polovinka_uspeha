import isEventExpired from '@helpers/isEventExpired'
// import eventsAtom from '@state/atoms/eventsAtom'
import { selectorFamily } from 'recoil'
// import eventsUsersByUserIdSelector from './eventsUsersByUserIdSelector'
// import eventsUsersFullByUserIdSelector from './eventsUsersFullByUserIdSelector'
import eventsUsersSignedUpByUserIdSelector from './eventsUsersSignedUpByUserIdSelector'

export const eventsUsersSignedUpWithEventStatusByUserIdCountSelector =
  selectorFamily({
    key: 'eventsUsersSignedUpWithEventStatusByUserIdCountSelector',
    get:
      (id) =>
      ({ get }) => {
        if (!id) return []
        const eventsUsers = get(eventsUsersSignedUpByUserIdSelector(id))
        const result = { signUp: 0, finished: 0 }
        console.log('eventsUsers', eventsUsers)
        eventsUsers.forEach((eventUser) => {
          if (isEventExpired(eventUser.event)) ++result.finished
          else ++result.signUp
        })

        return result
      },
  })

export default eventsUsersSignedUpWithEventStatusByUserIdCountSelector
