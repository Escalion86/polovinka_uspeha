import { atom } from 'jotai'

import { DEFAULT_EVENT } from '@helpers/constants'
import eventsAtom from '@state/atoms/eventsAtom'

const eventDeleteSelector = atom(
  () => DEFAULT_EVENT,
  (get, set, itemId) => {
    const items = get(eventsAtom)
    const newItemsList = items.filter((item) => item._id !== itemId)
    set(eventsAtom, newItemsList)
  }
)

export default eventDeleteSelector
