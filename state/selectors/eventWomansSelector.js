import { selectorFamily } from 'recoil'
import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

export const eventWomansSelector = selectorFamily({
  key: 'eventWomansSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventParticipantsFullByEventIdSelector(id))
        .filter((item) => item.user?.gender == 'famale')
        .map((item) => item.user)
    },
})

export default eventWomansSelector
