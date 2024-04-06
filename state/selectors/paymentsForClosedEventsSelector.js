import isEventClosed from '@helpers/isEventClosed'
import { selector } from 'recoil'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventSelector from './eventSelector'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'

export const allPaymentsForClosedEventsSelector = selector({
  key: 'paymentsForClosedEventsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      return get(asyncPaymentsAtom).filter((payment) => {
        if (!payment.eventId) return false
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
