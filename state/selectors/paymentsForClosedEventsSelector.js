import isEventClosed from '@helpers/isEventClosed'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'
import eventAtom from '@state/async/eventAtom'

export const allPaymentsForClosedEventsSelector = selector({
  key: 'paymentsForClosedEventsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      return get(paymentsAtom).filter((payment) => {
        if (!payment.eventId) return false
        const event = get(eventAtom(payment.eventId))
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
