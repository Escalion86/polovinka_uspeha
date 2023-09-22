import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selector } from 'recoil'

const eventsUsersDeleteByEventIdSelector = selector({
  key: 'eventsUsersDeleteByEventIdSelector',
  get: () => {
    return null
  },
  set: ({ set, get }, eventId) => {
    const items = get(eventsUsersAtom)
    const newItemsList = items.filter((item) => item.eventId !== eventId)
    set(eventsUsersAtom, newItemsList)
  },
})

export default eventsUsersDeleteByEventIdSelector
