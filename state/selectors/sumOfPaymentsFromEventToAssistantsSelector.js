import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventAssistantsIdsSelector from './eventAssistantsIdsSelector'
import paymentsOfEventWithNoCouponsFromAndToUsersSelector from './paymentsOfEventWithNoCouponsFromAndToUsersSelector'

const sumOfPaymentsFromEventToAssistantsSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const eventAssistants = await get(eventAssistantsIdsSelector(id))
    const payments = await get(
      paymentsOfEventWithNoCouponsFromAndToUsersSelector(id)
    )
    return (
      payments.reduce((p, payment) => {
        const isUserAssistant = eventAssistants.includes(payment.userId)
        if (isUserAssistant)
          return (
            p +
            (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
          )

        return p
      }, 0) / 100
    )
  })
)

export default sumOfPaymentsFromEventToAssistantsSelector
