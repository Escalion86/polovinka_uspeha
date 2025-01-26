import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import eventNotParticipantsWithPaymentsSelector from './eventNotParticipantsWithPaymentsSelector'
import paymentsOfEventFromAndToUsersSelector from './paymentsOfEventFromAndToUsersSelector'

const paymentsOfEventFromNotParticipantsSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return []
    const paymentsOfEvent = await get(paymentsOfEventFromAndToUsersSelector(id))
    const notParticipantsIdsWithPayments = await get(
      eventNotParticipantsWithPaymentsSelector(id)
    )

    return paymentsOfEvent.filter((payment) =>
      notParticipantsIdsWithPayments.includes(payment.userId)
    )
  })
)

export default paymentsOfEventFromNotParticipantsSelector
