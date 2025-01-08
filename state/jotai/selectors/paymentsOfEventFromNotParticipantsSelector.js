import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventNotParticipantsWithPaymentsSelector from './eventNotParticipantsWithPaymentsSelector'
import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

export const paymentsOfEventFromNotParticipantsSelector = atomFamily((id) =>
  atom((get) => {
    if (!id) return []
    const paymentsOfEvent = get(paymentsOfEventFromAndToUsersSelector(id))
    const notParticipantsIdsWithPayments = get(
      eventNotParticipantsWithPaymentsSelector(id)
    )

    return paymentsOfEvent.filter((payment) =>
      notParticipantsIdsWithPayments.includes(payment.userId)
    )
  })
)

export default paymentsOfEventFromNotParticipantsSelector
