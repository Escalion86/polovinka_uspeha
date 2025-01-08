import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventParticipantsIdsSelector from './eventParticipantsIdsSelector'
import paymentsOfEventWithNoCouponsFromAndToUsersSelector from './paymentsOfEventWithNoCouponsFromAndToUsersSelector'

export const sumOfPaymentsFromParticipantsSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return 0
    const eventParticipants = get(eventParticipantsIdsSelector(id))
    return (
      get(paymentsOfEventWithNoCouponsFromAndToUsersSelector(id)).reduce(
        (p, payment) => {
          const isUserParticipant = eventParticipants.includes(payment.userId)
          if (isUserParticipant)
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

export default sumOfPaymentsFromParticipantsSelector
