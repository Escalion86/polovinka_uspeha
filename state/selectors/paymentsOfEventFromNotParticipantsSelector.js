import { selectorFamily } from 'recoil'
import eventNotParticipantsWithPaymentsSelector from './eventNotParticipantsWithPaymentsSelector'
import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

export const paymentsOfEventFromNotParticipantsSelector = selectorFamily({
  key: 'paymentsOfEventFromNotParticipantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const paymentsOfEvent = get(paymentsOfEventFromAndToUsersSelector(id))
      const notParticipantsIdsWithPayments = get(
        eventNotParticipantsWithPaymentsSelector(id)
      )

      return paymentsOfEvent.filter((payment) =>
        notParticipantsIdsWithPayments.includes(payment.userId)
      )
    },
})

export default paymentsOfEventFromNotParticipantsSelector
