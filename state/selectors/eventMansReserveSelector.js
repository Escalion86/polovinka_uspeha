import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventMansReserveSelector = selectorFamily({
  key: 'eventMansReserveSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id))
        .filter(
          (item) => item.user?.gender == 'male' && item.status === 'reserve'
        )
        .map((item) => item.user)
    },
})

export default eventMansReserveSelector
