import { selectorFamily } from 'recoil'
import eventParticipantsSelector from './eventParticipantsSelector'
import eventSelector from './eventSelector'
import sumOfCouponsOfEventFromParticipantsSelector from './sumOfCouponsOfEventFromParticipantsSelector'

export const sumOfExpectingPaymentsOfEventFromParticipantsSelector =
  selectorFamily({
    key: 'sumOfExpectingPaymentsOfEventFromParticipantsSelector',
    get:
      (id) =>
      ({ get }) => {
        if (!id) return []
        const event = get(eventSelector(id))
        const eventParticipants = get(eventParticipantsSelector(id))
        const membersOfEventCount = eventParticipants.filter(
          (user) => user.status === 'member'
        ).length
        const noviceOfEventCount = eventParticipants.filter(
          (user) => user.status === 'novice'
        ).length
        const sumOfCouponsOfEventFromParticipants = get(
          sumOfCouponsOfEventFromParticipantsSelector(id)
        )

        return (
          (event.price * eventParticipants.length -
            membersOfEventCount * (event.usersStatusDiscount?.member ?? 0) -
            noviceOfEventCount * (event.usersStatusDiscount?.novice ?? 0)) /
            100 -
          sumOfCouponsOfEventFromParticipants
        )
      },
  })

export default sumOfExpectingPaymentsOfEventFromParticipantsSelector
