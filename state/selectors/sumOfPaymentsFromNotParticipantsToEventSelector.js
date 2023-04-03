import { selectorFamily } from 'recoil'
import paymentsOfEventFromNotParticipantsSelector from './paymentsOfEventFromNotParticipantsSelector'

export const sumOfPaymentsFromNotParticipantsToEventSelector = selectorFamily({
  key: 'sumOfPaymentsFromNotParticipantsToEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      const paymentsFromNotParticipants = get(
        paymentsOfEventFromNotParticipantsSelector(id)
      )
      return (
        paymentsFromNotParticipants.reduce((p, payment) => {
          return (
            p +
            (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
          )
        }, 0) / 100
      )
    },
})

export default sumOfPaymentsFromNotParticipantsToEventSelector
