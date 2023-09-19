import { selectorFamily } from 'recoil'
import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const totalIncomeOfEventSelector = selectorFamily({
  key: 'totalIncomeOfEventSelector',
  get:
    (id) =>
    ({ get }) => {
      if (!id) return []
      const paymentsOfEvent = get(paymentsByEventIdSelector(id))
      const income =
        paymentsOfEvent.reduce(
          (sum, payment) =>
            payment.payType === 'coupon'
              ? sum
              : [
                  'toEvent',
                  // 'toService',
                  // 'toProduct',
                  // 'toInternal',
                  'toUser',
                ].includes(payment.payDirection)
              ? sum - payment.sum
              : sum + payment.sum,
          0
        ) / 100

      return income

      // return (
      //   get(sumOfPaymentsFromParticipantsSelector(id)) +
      //   get(sumOfPaymentsFromEventToAssistantsSelector(id)) +
      //   get(sumOfPaymentsToEventSelector(id)) +
      //   get(sumOfPaymentsFromEventSelector(id)) +
      //   get(sumOfPaymentsFromNotParticipantsToEventSelector(id))
      // )
    },
})

export default totalIncomeOfEventSelector
