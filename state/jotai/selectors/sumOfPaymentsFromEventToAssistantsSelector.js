import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventAssistantsIdsSelector from './eventAssistantsIdsSelector'
import paymentsOfEventWithNoCouponsFromAndToUsersSelector from './paymentsOfEventWithNoCouponsFromAndToUsersSelector'

export const sumOfPaymentsFromEventToAssistantsSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    const eventAssistants = get(eventAssistantsIdsSelector(id))
    return (
      get(paymentsOfEventWithNoCouponsFromAndToUsersSelector(id)).reduce(
        (p, payment) => {
          const isUserAssistant = eventAssistants.includes(payment.userId)
          if (isUserAssistant)
            return (
              p +
              (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
            )

          return p
        },
        0
      ) / 100
    )
  })
)

export default sumOfPaymentsFromEventToAssistantsSelector
