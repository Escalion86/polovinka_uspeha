import { atom } from 'jotai'

import isEventClosed from '@helpers/isEventClosed'
import eventsAtom from '@state/atoms/eventsAtom'

const modalSelector = atom((get) =>
  get(eventsAtom).filter((event) => isEventClosed(event))
)

export default modalSelector
