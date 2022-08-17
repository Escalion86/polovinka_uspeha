import { selectorFamily } from 'recoil'
import eventsUsersFullByEventIdSelector from './eventsUsersFullByEventIdSelector'

export const eventAssistantsSelector = selectorFamily({
  key: 'eventAssistantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventsUsersFullByEventIdSelector(id))
        .filter((item) => item.user && item.status === 'assistant')
        .map((item) => item.user)
    },
})

export default eventAssistantsSelector
