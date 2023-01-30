import isEventExpired from '@helpers/isEventExpired'
import { selectorFamily } from 'recoil'
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
        eventsUsers.forEach((eventUser) => {
          if (isEventExpired(eventUser.event)) ++result.finished
          else ++result.signUp
        })

        return result
      },
  })

export default eventsUsersSignedUpWithEventStatusByUserIdCountSelector
