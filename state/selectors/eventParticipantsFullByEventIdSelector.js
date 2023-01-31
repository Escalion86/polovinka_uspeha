import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventParticipantsFullByEventIdSelector = selectorFamily({
  key: 'eventParticipantsFullByEventIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id)).filter(
        (item) => item.status === 'participant'
      )
    },
})

export default eventParticipantsFullByEventIdSelector
