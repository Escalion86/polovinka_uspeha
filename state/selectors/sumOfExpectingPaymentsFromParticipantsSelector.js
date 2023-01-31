import { selectorFamily } from 'recoil'
import eventParticipantsFullByEventIdSelector from './eventParticipantsFullByEventIdSelector'
// import eventParticipantsSelector from './eventParticipantsSelector'
import eventSelector from './eventSelector'
import sumOfCouponsFromParticipantsSelector from './sumOfCouponsFromParticipantsSelector'

export const sumOfExpectingPaymentsFromParticipantsSelector = selectorFamily({
  key: 'sumOfExpectingPaymentsFromParticipantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const event = get(eventSelector(id))
      // const eventParticipants = get(eventParticipantsSelector(id))
      const eventParticipantsFull = get(
        eventParticipantsFullByEventIdSelector(id)
      )
      const membersOfEventCount = eventParticipantsFull.filter(
        ({ userStatus }) => userStatus === 'member'
      ).length
      const noviceOfEventCount = eventParticipantsFull.filter(
        ({ userStatus }) =>
          !userStatus || userStatus === 'novice' || userStatus === 'ban'
      ).length
      const sumOfCouponsOfEventFromParticipants = get(
        sumOfCouponsFromParticipantsSelector(id)
      )

      return (
        (event.price * eventParticipantsFull.length -
          membersOfEventCount * (event.usersStatusDiscount?.member ?? 0) -
          noviceOfEventCount * (event.usersStatusDiscount?.novice ?? 0)) /
          100 -
        sumOfCouponsOfEventFromParticipants
      )
    },
})

export default sumOfExpectingPaymentsFromParticipantsSelector
