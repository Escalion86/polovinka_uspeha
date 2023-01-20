import { selectorFamily } from 'recoil'
import eventParticipantsSelector from './eventParticipantsSelector'

export const membersOfEventSelector = selectorFamily({
  key: 'membersOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []

      return get(eventParticipantsSelector(id)).filter(
        (user) => user.status === 'member'
      )
    },
})

export default membersOfEventSelector
