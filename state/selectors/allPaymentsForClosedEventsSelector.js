import isEventClosed from '@helpers/isEventClosed'
import { selector } from 'recoil'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventSelector from './eventSelector'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

export const allPaymentsForClosedEventsSelector = selector({
  key: 'allPaymentsForClosedEventsSelector',
  get: ({ get }) => {
    return get(asyncPaymentsAtom).filter((payment) => {
      const event = get(eventSelector(payment.eventId))
      return isEventClosed(event)
    })
  },
  // set:
  //   (id) =>
  //   ({ set }, event) => {
  //     set(eventsSelector, event)
  //   },
})

export default allPaymentsForClosedEventsSelector
