import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventMansSelector = selectorFamily({
  key: 'eventMansSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id))
        .filter(
          (item) => item.user?.gender == 'male' && item.status === 'participant'
        )
        .map((item) => item.user)
    },
})

export default eventMansSelector
