import { selectorFamily } from 'recoil'
import eventAssistantsSelector from './eventAssistantsSelector'

export const eventAssistantsIdsSelector = selectorFamily({
  key: 'eventAssistantsIdsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventAssistantsSelector(id)).map((user) => user._id)
    },
})

export default eventAssistantsIdsSelector
