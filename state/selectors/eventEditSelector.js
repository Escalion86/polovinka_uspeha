import { DEFAULT_EVENT } from '@helpers/constants'
import eventsAtom from '@state/atoms/eventsAtom'
import { selector } from 'recoil'

const eventEditSelector = selector({
  key: 'eventEditSelector',
  get: () => DEFAULT_EVENT,
  set: ({ set, get }, newItem) => {
    const items = get(eventsAtom)
    if (!newItem?._id) return
    const findedItem = items.find((event) => event._id === newItem._id)
    // Если мы обновляем существующий атом
    if (findedItem) {
      const newItemsList = items.map((event) => {
        if (event._id === newItem._id) return newItem
        return event
      })
      set(eventsAtom, newItemsList)
    } else {
      // Если такого атома нет и мы добавляем новый, то просто добавляем атом в список
      set(eventsAtom, [...items, newItem])
    }
  },
})

export default eventEditSelector
