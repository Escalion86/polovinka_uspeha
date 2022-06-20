import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selectorFamily } from 'recoil'

export const eventsUsersSelectorByEventId = selectorFamily({
  key: 'eventsUsersSelectorByEventId',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      const eventsUsers = get(eventsUsersAtom)
      return eventsUsers
        ? eventsUsers.filter((item) => item.eventId === id)
        : []
    },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default eventsUsersSelectorByEventId
