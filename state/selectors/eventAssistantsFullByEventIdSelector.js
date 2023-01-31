import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventAssistantsFullByEventIdSelector = selectorFamily({
  key: 'eventAssistantsFullByEventIdSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id)).filter(
        (item) => item.status === 'assistant'
      )
    },
})

export default eventAssistantsFullByEventIdSelector
