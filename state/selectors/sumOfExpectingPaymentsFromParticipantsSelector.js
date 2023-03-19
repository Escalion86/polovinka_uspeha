import eventPricesWithStatus from '@helpers/eventPricesWithStatus'
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
        ({ userStatus, user }) => userStatus === 'member'
        //  || (!userStatus && user.status === 'member')
      ).length
      const noviceOfEventCount = eventParticipantsFull.filter(
        ({ userStatus, user }) => userStatus === 'novice'
        //  ||
        // (!userStatus &&
        //   (!user.status || user.status === 'novice' || user.status === 'ban'))
      ).length
      // const bannedAndNoStatusUsersOfEventCount = eventParticipantsFull.filter(
      //   ({ userStatus, user }) =>
      //     userStatus === 'ban' || !userStatus
      // ).length
      const sumOfCouponsOfEventFromParticipants = get(
        sumOfCouponsFromParticipantsSelector(id)
      )

      const eventPrices = eventPricesWithStatus(event)
      // event.price * eventParticipantsFull.length -
      // membersOfEventCount * (event.usersStatusDiscount?.member ?? 0) -
      // noviceOfEventCount * (event.usersStatusDiscount?.novice ?? 0))
      return (
        (eventPrices.member * membersOfEventCount +
          eventPrices.novice * noviceOfEventCount) /
          100 -
        sumOfCouponsOfEventFromParticipants
      )
    },
})

export default sumOfExpectingPaymentsFromParticipantsSelector
