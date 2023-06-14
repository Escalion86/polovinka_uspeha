import isEventClosed from '@helpers/isEventClosed'
import eventsAtom from '@state/atoms/eventsAtom'
import { selector } from 'recoil'

export const modalSelector = selector({
  key: 'modalSelector',
  get: ({ get }) => get(eventsAtom).filter((event) => isEventClosed(event)),
})

export default modalSelector
