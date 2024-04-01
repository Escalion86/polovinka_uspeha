import isEventClosed from '@helpers/isEventClosed'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'
// import eventFullAtomAsync from '@state/async/eventFullAtomAsync'
import eventSelector from './eventSelector'

export const allPaymentsForClosedEventsSelector = selector({
  key: 'allPaymentsForClosedEventsSelector',
  get: ({ get }) => {
    return get(paymentsAtom).filter((payment) => {
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
