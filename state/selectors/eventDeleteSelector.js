import { atom } from 'jotai'

import eventsAtom from '@state/atoms/eventsAtom'

const eventDeleteSelector = atom(null, (get, set, itemId) => {
  const items = get(eventsAtom)
  const newItemsList = items.filter((item) => item._id !== itemId)
  set(eventsAtom, newItemsList)
})

export default eventDeleteSelector
