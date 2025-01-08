import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsByEventIdSelector from './paymentsByEventIdSelector'

export const totalIncomeOfEventSelector = atomFamily((id) =>
  atom((get) => {
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
  })
)

export default totalIncomeOfEventSelector
