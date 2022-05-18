import { DEFAULT_EVENT } from '@helpers/constants'
import eventsAtom from '@state/atoms/eventsAtom'
import { selector } from 'recoil'

const eventDeleteSelector = selector({
  key: 'eventDeleteSelector',
  get: () => DEFAULT_EVENT,
  set: ({ set, get }, itemId) => {
    const items = get(eventsAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(eventsAtom, newItemsList)
  },
})

export default eventDeleteSelector
