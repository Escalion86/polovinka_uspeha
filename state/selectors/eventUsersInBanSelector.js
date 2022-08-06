import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventUsersInBanSelector = selectorFamily({
  key: 'eventUsersInBanSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id))
        .filter((item) => item.status === 'ban')
        .map((item) => item.user)
    },
})

export default eventUsersInBanSelector
