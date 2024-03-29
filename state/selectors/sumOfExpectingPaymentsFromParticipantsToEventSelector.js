import eventPricesWithStatus from '@helpers/eventPricesWithStatus'
import { selectorFamily } from 'recoil'
import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'
// import eventParticipantsSelector from './eventParticipantsSelector'
import eventAtom from '@state/async/eventAtom'
import sumOfCouponsFromParticipantsToEventSelector from './sumOfCouponsFromParticipantsToEventSelector'

export const sumOfExpectingPaymentsFromParticipantsToEventSelector =
  selectorFamily({
    key: 'sumOfExpectingPaymentsFromParticipantsToEventSelector',
    get:
      (id) =>
      ({ get }) => {
        if (!id) return []
        const event = get(eventAtom(id))
        const eventParticipantsFull = get(
          eventParticipantsFullByEventIdSelector(id)
        )

        const sumOfCouponsOfEventFromParticipants = get(
          sumOfCouponsFromParticipantsToEventSelector(id)
        )

        var sumOfExpectingPayments = 0
        event.subEvents.forEach((subEvent) => {
          const subEventPrices = eventPricesWithStatus(subEvent)
          eventParticipantsFull.forEach(({ userStatus, subEventId }) => {
            if (subEvent.id === subEventId && userStatus !== 'ban')
              sumOfExpectingPayments +=
                userStatus === 'member'
                  ? subEventPrices.member
                  : subEventPrices.novice
          })
        })

        // const eventPrices = eventPricesWithStatus(event)
        // event.price * eventParticipantsFull.length -
        // membersOfEventCount * (event.usersStatusDiscount?.member ?? 0) -
        // noviceOfEventCount * (event.usersStatusDiscount?.novice ?? 0))
        return (
          sumOfExpectingPayments / 100 - sumOfCouponsOfEventFromParticipants
        )
      },
  })

export default sumOfExpectingPaymentsFromParticipantsToEventSelector
