import { selectorFamily } from 'recoil'
import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

export const eventMansSelector = selectorFamily({
  key: 'eventMansSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventParticipantsFullByEventIdSelector(id))
        .filter((item) => item.user?.gender == 'male')
        .map((item) => item.user)
    },
})

export default eventMansSelector
