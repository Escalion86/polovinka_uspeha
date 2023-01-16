import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventParticipantsSelector = selectorFamily({
  key: 'eventParticipantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id))
        .filter((item) => item.status === 'participant')
        .map((item) => item.user)
    },
})

export default eventParticipantsSelector
