import isEventClosed from '@helpers/isEventClosed'
import paymentsAtom from '@state/atoms/paymentsAtom'
import { selector } from 'recoil'
import eventSelector from './eventSelector'

export const allPaymentsForClosedEventsSelector = selector({
  key: 'paymentsForClosedEventsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return null
      return get(paymentsAtom).filter((payment) => {
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
