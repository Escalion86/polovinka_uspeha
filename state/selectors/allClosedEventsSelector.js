import isEventClosed from '@helpers/isEventClosed'
import eventsAtom from '@state/atoms/eventsAtom'
import { selector } from 'recoil'

export const allClosedEventsSelector = selector({
  key: 'allClosedEventsSelector',
  get: ({ get }) => get(eventsAtom).filter((event) => isEventClosed(event)),
})

export default allClosedEventsSelector
