import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventUsersInReserveSelector = selectorFamily({
  key: 'eventUsersInReserveSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id))
        .filter((item) => item.status === 'reserve')
        .map((item) => item.user)
    },
})

export default eventUsersInReserveSelector
