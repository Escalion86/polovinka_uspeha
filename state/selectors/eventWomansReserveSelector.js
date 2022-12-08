import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventWomansReserveSelector = selectorFamily({
  key: 'eventWomansReserveSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id))
        .filter(
          (item) => item.user?.gender == 'famale' && item.status === 'reserve'
        )
        .map((item) => item.user)
    },
})

export default eventWomansReserveSelector
