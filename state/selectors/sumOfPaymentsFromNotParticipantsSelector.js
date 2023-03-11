import { selectorFamily } from 'recoil'
import paymentsFromNotParticipantsSelector from './paymentsFromNotParticipantsSelector'

export const sumOfPaymentsFromNotParticipantsSelector = selectorFamily({
  key: 'sumOfPaymentsFromNotParticipantsSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return 0
      const paymentsFromNotParticipants = get(
        paymentsFromNotParticipantsSelector(id)
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

export default sumOfPaymentsFromNotParticipantsSelector
