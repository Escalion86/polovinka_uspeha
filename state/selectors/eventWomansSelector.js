import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventWomansSelector = selectorFamily({
  key: 'eventWomansSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id))
        .filter(
          (item) =>
            item.user?.gender == 'famale' && item.status === 'participant'
        )
        .map((item) => item.user)
    },
})

export default eventWomansSelector
