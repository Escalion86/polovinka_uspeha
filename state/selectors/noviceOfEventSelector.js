import { selectorFamily } from 'recoil'
import eventParticipantsSelector from './eventParticipantsSelector'

export const noviceOfEventSelector = selectorFamily({
  key: 'noviceOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventParticipantsSelector(id)).filter(
        (user) => user.status === 'novice'
      )
    },
})

export default noviceOfEventSelector
