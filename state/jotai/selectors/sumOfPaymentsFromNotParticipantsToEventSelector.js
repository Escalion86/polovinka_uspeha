import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import paymentsOfEventFromNotParticipantsSelector from './paymentsOfEventFromNotParticipantsSelector'

export const sumOfPaymentsFromNotParticipantsToEventSelector = atomFamily(
  (id) =>
    atom((get) => {
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
    })
)

export default sumOfPaymentsFromNotParticipantsToEventSelector
