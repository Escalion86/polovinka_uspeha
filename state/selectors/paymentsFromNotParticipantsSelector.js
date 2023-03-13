import { selectorFamily } from 'recoil'
import eventNotParticipantsWithPaymentsSelector from './eventNotParticipantsWithPaymentsSelector'
import paymentsFromAndToUsersSelector from './paymentsFromAndToUsersSelector'

export const paymentsFromNotParticipantsSelector = selectorFamily({
  key: 'paymentsFromNotParticipantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const paymentsOfEvent = get(paymentsFromAndToUsersSelector(id))
      const notParticipantsIdsWithPayments = get(
        eventNotParticipantsWithPaymentsSelector(id)
      )

      return paymentsOfEvent.filter((payment) =>
        notParticipantsIdsWithPayments.includes(payment.userId)
      )
    },
})

export default paymentsFromNotParticipantsSelector
