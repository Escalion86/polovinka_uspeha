import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import { selector } from 'recoil'

const eventsUsersDeleteSelector = selector({
  key: 'eventsUsersDeleteSelector',
  get: () => {
    return null
  },
  set: ({ set, get }, itemId) => {
    const items = get(eventsUsersAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(eventsUsersAtom, newItemsList)
  },
})

export default eventsUsersDeleteSelector
