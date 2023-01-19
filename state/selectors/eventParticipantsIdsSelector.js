import { selectorFamily } from 'recoil'
import eventParticipantsSelector from './eventParticipantsSelector'

export const eventParticipantsIdsSelector = selectorFamily({
  key: 'eventParticipantsIdsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventParticipantsSelector(id)).map((user) => user._id)
    },
})

export default eventParticipantsIdsSelector
