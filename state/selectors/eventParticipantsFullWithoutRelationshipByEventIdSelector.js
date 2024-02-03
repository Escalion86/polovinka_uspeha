import { selectorFamily } from 'recoil'
import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'

export const eventParticipantsFullWithoutRelationshipByEventIdSelector =
  selectorFamily({
    key: 'eventParticipantsFullWithoutRelationshipByEventIdSelector',
    get:
      (id) =>
      ({ get }) => {
        if (!id) return []

        return get(eventParticipantsFullByEventIdSelector(id)).filter(
          (item) => !item.user?.relationship
        )
      },
  })

export default eventParticipantsFullWithoutRelationshipByEventIdSelector
