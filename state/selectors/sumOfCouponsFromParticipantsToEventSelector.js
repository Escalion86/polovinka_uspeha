import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

import couponsOfEventFromUsersSelector from './couponsOfEventFromUsersSelector'
import eventParticipantsIdsSelector from './eventParticipantsIdsSelector'

export const sumOfCouponsFromParticipantsToEventSelector = atomFamily((id) =>
  atom(async (get) => {
    if (!id) return 0
    const coupons = await get(couponsOfEventFromUsersSelector(id))
    return (
      (await Promise.all(
        coupons.reduce(async (p, payment) => {
          const participantsIds = await get(eventParticipantsIdsSelector(id))
          const isUserParticipant = participantsIds.includes(payment.userId)
          if (isUserParticipant)
            return (
              p +
              (payment.sum ?? 0) * (payment.payDirection === 'toUser' ? -1 : 1)
            )

          return p
        }, 0)
      )) / 100
    )
  })
)

export default sumOfCouponsFromParticipantsToEventSelector
